"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
const institutions_service_1 = require("../institutions/institutions.service");
let AnalyticsController = class AnalyticsController {
    constructor(dataSource, institutionsService) {
        this.dataSource = dataSource;
        this.institutionsService = institutionsService;
    }
    async districtHeatmap() {
        const rows = await this.dataSource.query(`SELECT district, COUNT(*) as count,
              AVG(priority_score) as avg_priority,
              ST_AsGeoJSON(ST_Centroid(ST_Collect(location::geometry))) as centroid
       FROM problems
       WHERE district IS NOT NULL
       GROUP BY district
       ORDER BY count DESC`);
        return rows.map((r) => ({
            district: r.district,
            count: parseInt(r.count),
            avgPriority: parseFloat(r.avg_priority || '0'),
            centroid: r.centroid ? JSON.parse(r.centroid) : null,
        }));
    }
    async categoryDistribution() {
        const rows = await this.dataSource.query(`SELECT category, COUNT(*) as count,
              COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
       FROM problems
       GROUP BY category
       ORDER BY count DESC`);
        return rows.map((r) => ({
            category: r.category,
            total: parseInt(r.count),
            resolved: parseInt(r.resolved || '0'),
        }));
    }
    async submitterDistribution() {
        const rows = await this.dataSource.query(`SELECT submitter_type, COUNT(*) as count,
              COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
              AVG(priority_score) as avg_priority
       FROM problems
       GROUP BY submitter_type
       ORDER BY count DESC`);
        return rows.map((r) => ({
            submitterType: r.submitter_type || 'individual',
            count: parseInt(r.count),
            resolved: parseInt(r.resolved || '0'),
            avgPriority: Math.round(parseFloat(r.avg_priority || '0') * 10) / 10,
        }));
    }
    async statusFunnel() {
        const rows = await this.dataSource.query(`SELECT status, COUNT(*) as count FROM problems GROUP BY status`);
        const statuses = ['submitted', 'under_review', 'assigned', 'team_formed', 'prototype', 'piloted', 'resolved'];
        const countMap = {};
        rows.forEach((r) => (countMap[r.status] = parseInt(r.count)));
        return statuses.map((s) => ({ status: s, count: countMap[s] || 0 }));
    }
    leaderboard() {
        return this.institutionsService.getLeaderboard();
    }
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
    async recentActivity(limit = 10) {
        const rows = await this.dataSource.query(`SELECT p.id, p.title, p.status, p.category, p.district, p.created_at,
              u.name as submitted_by
       FROM problems p
       LEFT JOIN users u ON u.id = p.submitted_by_id
       WHERE p.duplicate_of_id IS NULL
       ORDER BY p.created_at DESC
       LIMIT $1`, [+limit]);
        return rows;
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('district-heatmap'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'District-wise problem count for heatmap (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "districtHeatmap", null);
__decorate([
    (0, common_1.Get)('category-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Problem count by category for bar chart' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "categoryDistribution", null);
__decorate([
    (0, common_1.Get)('submitter-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Problem count and priority broken down by submitter type' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "submitterDistribution", null);
__decorate([
    (0, common_1.Get)('status-funnel'),
    (0, swagger_1.ApiOperation)({ summary: 'Problem status funnel (submitted → resolved)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "statusFunnel", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Institution leaderboard ranked by resolved problems' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "leaderboard", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Summary KPI counts (total, resolved, active teams etc.)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('recent-activity'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Recent problems and team formations' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "recentActivity", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        institutions_service_1.InstitutionsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map