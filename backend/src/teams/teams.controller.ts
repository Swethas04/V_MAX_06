import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, Request, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto, CreateMilestoneDto, UpdateMilestoneDto, IndustryOfferDto } from './dto/teams.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Post()
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new project team (faculty/admin)' })
  create(@Body() dto: CreateTeamDto) {
    return this.service.createTeam(dto);
  }

  @Get('proposals')
  @Roles(UserRole.INDUSTRY_PARTNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Browse open proposals (industry partner view)' })
  browseProposals(
    @Query('tags') tags?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const domainTags = tags ? tags.split(',') : undefined;
    return this.service.browseProposals(domainTags, +page, +limit);
  }

  @Get('institution/:institutionId')
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  @ApiOperation({ summary: "Get institution's teams" })
  getByInstitution(@Param('institutionId', ParseUUIDPipe) id: string) {
    return this.service.getByInstitution(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team details' })
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getOne(id);
  }

  @Post(':id/students/:studentId')
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add a student to team' })
  addStudent(@Param('id', ParseUUIDPipe) id: string, @Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.service.addStudent(id, studentId);
  }

  @Delete(':id/students/:studentId')
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove a student from team' })
  removeStudent(@Param('id', ParseUUIDPipe) id: string, @Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.service.removeStudent(id, studentId);
  }

  @Patch(':id/mentor/:facultyId')
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  @ApiOperation({ summary: 'Set faculty mentor for a team' })
  setMentor(@Param('id', ParseUUIDPipe) id: string, @Param('facultyId', ParseUUIDPipe) facultyId: string) {
    return this.service.setFacultyMentor(id, facultyId);
  }

  @Post(':id/offer')
  @Roles(UserRole.INDUSTRY_PARTNER)
  @ApiOperation({ summary: 'Submit industry partnership offer' })
  submitOffer(@Param('id', ParseUUIDPipe) id: string, @Request() req: any, @Body() dto: IndustryOfferDto) {
    return this.service.submitOffer(id, req.user.id, dto);
  }

  // ─── Milestones / Kanban ────────────────────────────────────

  @Get(':id/kanban')
  @ApiOperation({ summary: 'Get Kanban board (milestones grouped by status)' })
  getKanban(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getKanban(id);
  }

  @Post(':id/milestones')
  @Roles(UserRole.FACULTY, UserRole.STUDENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a milestone for the project Kanban' })
  createMilestone(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateMilestoneDto) {
    return this.service.createMilestone(id, dto);
  }

  @Patch('milestones/:milestoneId')
  @Roles(UserRole.FACULTY, UserRole.STUDENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update milestone status (Kanban drag)' })
  updateMilestone(@Param('milestoneId', ParseUUIDPipe) id: string, @Body() dto: UpdateMilestoneDto) {
    return this.service.updateMilestone(id, dto);
  }

  @Delete('milestones/:milestoneId')
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a milestone' })
  deleteMilestone(@Param('milestoneId', ParseUUIDPipe) id: string) {
    return this.service.deleteMilestone(id);
  }
}
