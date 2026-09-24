import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { InstitutionsService } from '../institutions/institutions.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly institutionsService: InstitutionsService,
  ) {}

  /** District-wise problem density (for Leaflet heatmap) */
  @Get('district-heatmap')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'District-wise problem count for heatmap (admin)' })
  async districtHeatmap() {
    const rows = await this.dataSource.query(
      `SELECT district, COUNT(*) as count,
              AVG(priority_score) as avg_priority,
              ST_AsGeoJSON(ST_Centroid(ST_Collect(location::geometry))) as centroid
       FROM problems
       WHERE district IS NOT NULL
       GROUP BY district
       ORDER BY count DESC`,
    );
    return rows.map((r: any) => ({
      district: r.district,
      count: parseInt(r.count),
      avgPriority: parseFloat(r.avg_priority || '0'),
      centroid: r.centroid ? JSON.parse(r.centroid) : null,
    }));
  }

  /** Theme/category-wise problem distribution (bar chart) */
  @Get('category-distribution')
  @ApiOperation({ summary: 'Problem count by category for bar chart' })
  async categoryDistribution() {
    const rows = await this.dataSource.query(
      `SELECT category, COUNT(*) as count,
              COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
       FROM problems
       GROUP BY category
       ORDER BY count DESC`,
    );
    return rows.map((r: any) => ({
      category: r.category,
      total: parseInt(r.count),
      resolved: parseInt(r.resolved || '0'),
    }));
  }

  /** Submitter type breakdown (Individual vs PRI vs ULB vs Govt Dept vs Community Org) */
  @Get('submitter-distribution')
  @ApiOperation({ summary: 'Problem count and priority broken down by submitter type' })
  async submitterDistribution() {
    const rows = await this.dataSource.query(
      `SELECT submitter_type, COUNT(*) as count,
              COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
              AVG(priority_score) as avg_priority
       FROM problems
       GROUP BY submitter_type
       ORDER BY count DESC`,
    );
    return rows.map((r: any) => ({
      submitterType: r.submitter_type || 'individual',
      count: parseInt(r.count),
      resolved: parseInt(r.resolved || '0'),
      avgPriority: Math.round(parseFloat(r.avg_priority || '0') * 10) / 10,
    }));
  }

  /** Funnel: submitted → resolved conversion */
  @Get('status-funnel')
  @ApiOperation({ summary: 'Problem status funnel (submitted → resolved)' })
  async statusFunnel() {
    const rows = await this.dataSource.query(
      `SELECT status, COUNT(*) as count FROM problems GROUP BY status`,
    );
    const statuses = ['submitted', 'under_review', 'assigned', 'team_formed', 'prototype', 'piloted', 'resolved'];
    const countMap: Record<string, number> = {};
    rows.forEach((r: any) => (countMap[r.status] = parseInt(r.count)));
    return statuses.map((s) => ({ status: s, count: countMap[s] || 0 }));
  }

  /** Institution leaderboard (ranked by problems resolved) */
  @Get('leaderboard')
  @ApiOperation({ summary: 'Institution leaderboard ranked by resolved problems' })
  leaderboard() {
    return this.institutionsService.getLeaderboard();
  }

  /** Summary KPIs */
  @Get('summary')
  @ApiOperation({ summary: 'Summary KPI counts (total, resolved, active teams etc.)' })
  async summary() {
    const [problems, teams, users, resolved] = await Promise.all([
      this.dataSource.query(`SELECT COUNT(*) FROM problems WHERE duplicate_of_id IS NULL`),
      this.dataSource.query(`SELECT COUNT(*) FROM project_teams`),
      this.dataSource.query(`SELECT COUNT(*) FROM users WHERE role = 'citizen'`),
      this.dataSource.query(`SELECT COUNT(*) FROM problems WHERE status = 'resolved'`),
    ]);
    return {
      totalProblems: parseInt(problems[0].count),
      totalTeams: parseInt(teams[0].count),
      totalCitizens: parseInt(users[0].count),
      resolvedProblems: parseInt(resolved[0].count),
      resolutionRate: problems[0].count > 0
        ? ((resolved[0].count / problems[0].count) * 100).toFixed(1) + '%'
        : '0%',
    };
  }

  /** Recent activity feed */
  @Get('recent-activity')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Recent problems and team formations' })
  async recentActivity(@Query('limit') limit = 10) {
    const rows = await this.dataSource.query(
      `SELECT p.id, p.title, p.status, p.category, p.district, p.created_at,
              u.name as submitted_by
       FROM problems p
       LEFT JOIN users u ON u.id = p.submitted_by_id
       WHERE p.duplicate_of_id IS NULL
       ORDER BY p.created_at DESC
       LIMIT $1`,
      [+limit],
    );
    return rows;
  }
}
