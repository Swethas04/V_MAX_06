import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTeam, TeamStatus } from './project-team.entity';
import { Milestone, MilestoneStatus } from './milestone.entity';
import { CreateTeamDto, CreateMilestoneDto, UpdateMilestoneDto, IndustryOfferDto } from './dto/teams.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(ProjectTeam) private readonly teamRepo: Repository<ProjectTeam>,
    @InjectRepository(Milestone) private readonly milestoneRepo: Repository<Milestone>,
  ) {}

  /** Create a new project team */
  async createTeam(dto: CreateTeamDto): Promise<ProjectTeam> {
    const team = this.teamRepo.create({
      problemId: dto.problemId,
      institutionId: dto.institutionId,
      studentIds: dto.studentIds || [],
      facultyMentorId: dto.facultyMentorId,
      domainTags: dto.domainTags || [],
      proposalSummary: dto.proposalSummary,
      status: TeamStatus.FORMING,
    });
    return this.teamRepo.save(team);
  }

  /** Get teams for a specific institution */
  async getByInstitution(institutionId: string) {
    return this.teamRepo.find({
      where: { institutionId },
      relations: { problem: true, milestones: true },
      order: { createdAt: 'DESC' },
    });
  }

  /** Get a team with full details */
  async getOne(id: string): Promise<ProjectTeam> {
    const team = await this.teamRepo.findOne({
      where: { id },
      relations: { problem: true, milestones: true },
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  /** Add student to team by user ID */
  async addStudent(teamId: string, studentId: string): Promise<ProjectTeam> {
    const team = await this.getOne(teamId);
    if (!team.studentIds.includes(studentId)) {
      team.studentIds = [...team.studentIds, studentId];
      await this.teamRepo.save(team);
    }
    return team;
  }

  /** Remove student from team */
  async removeStudent(teamId: string, studentId: string): Promise<ProjectTeam> {
    const team = await this.getOne(teamId);
    team.studentIds = team.studentIds.filter((sid: string) => sid !== studentId);
    return this.teamRepo.save(team);
  }

  /** Set faculty mentor */
  async setFacultyMentor(teamId: string, facultyId: string): Promise<ProjectTeam> {
    const team = await this.getOne(teamId);
    team.facultyMentorId = facultyId;
    team.status = TeamStatus.ACTIVE;
    return this.teamRepo.save(team);
  }

  /** Submit industry offer */
  async submitOffer(teamId: string, partnerId: string, dto: IndustryOfferDto): Promise<ProjectTeam> {
    const team = await this.getOne(teamId);
    team.industryPartnerId = partnerId;
    team.industryOffer = dto;
    return this.teamRepo.save(team);
  }

  /** Browse proposals for industry partners (filter by domain tags) */
  async browseProposals(domainTags?: string[], page = 1, limit = 20) {
    const qb = this.teamRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.problem', 'problem')
      .leftJoinAndSelect('t.milestones', 'milestones')
      .where('t.proposalSummary IS NOT NULL')
      .andWhere('t.industryPartnerId IS NULL') // open for partnership
      .orderBy('t.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (domainTags && domainTags.length > 0) {
      qb.andWhere('t.domainTags && :tags', { tags: domainTags });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Milestones (Kanban) ─────────────────────────────────────

  async createMilestone(teamId: string, dto: CreateMilestoneDto): Promise<Milestone> {
    const team = await this.getOne(teamId);
    const count = await this.milestoneRepo.count({ where: { teamId } });
    const milestone = this.milestoneRepo.create({
      teamId: team.id,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
      status: MilestoneStatus.TODO,
      orderIndex: count,
    });
    return this.milestoneRepo.save(milestone);
  }

  async updateMilestone(milestoneId: string, dto: UpdateMilestoneDto): Promise<Milestone> {
    const milestone = await this.milestoneRepo.findOne({ where: { id: milestoneId } });
    if (!milestone) throw new NotFoundException('Milestone not found');
    Object.assign(milestone, dto);
    return this.milestoneRepo.save(milestone);
  }

  async deleteMilestone(milestoneId: string): Promise<void> {
    await this.milestoneRepo.delete(milestoneId);
  }

  async getKanban(teamId: string) {
    const milestones = await this.milestoneRepo.find({
      where: { teamId },
      order: { orderIndex: 'ASC' },
    });
    return {
      todo: milestones.filter((m) => m.status === MilestoneStatus.TODO),
      inProgress: milestones.filter((m) => m.status === MilestoneStatus.IN_PROGRESS),
      done: milestones.filter((m) => m.status === MilestoneStatus.DONE),
      blocked: milestones.filter((m) => m.status === MilestoneStatus.BLOCKED),
    };
  }
}
