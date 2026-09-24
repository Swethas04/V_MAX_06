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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_team_entity_1 = require("./project-team.entity");
const milestone_entity_1 = require("./milestone.entity");
let TeamsService = class TeamsService {
    constructor(teamRepo, milestoneRepo) {
        this.teamRepo = teamRepo;
        this.milestoneRepo = milestoneRepo;
    }
    async createTeam(dto) {
        const team = this.teamRepo.create({
            problemId: dto.problemId,
            institutionId: dto.institutionId,
            studentIds: dto.studentIds || [],
            facultyMentorId: dto.facultyMentorId,
            domainTags: dto.domainTags || [],
            proposalSummary: dto.proposalSummary,
            status: project_team_entity_1.TeamStatus.FORMING,
        });
        return this.teamRepo.save(team);
    }
    async getByInstitution(institutionId) {
        return this.teamRepo.find({
            where: { institutionId },
            relations: { problem: true, milestones: true },
            order: { createdAt: 'DESC' },
        });
    }
    async getOne(id) {
        const team = await this.teamRepo.findOne({
            where: { id },
            relations: { problem: true, milestones: true },
        });
        if (!team)
            throw new common_1.NotFoundException('Team not found');
        return team;
    }
    async addStudent(teamId, studentId) {
        const team = await this.getOne(teamId);
        if (!team.studentIds.includes(studentId)) {
            team.studentIds = [...team.studentIds, studentId];
            await this.teamRepo.save(team);
        }
        return team;
    }
    async removeStudent(teamId, studentId) {
        const team = await this.getOne(teamId);
        team.studentIds = team.studentIds.filter((sid) => sid !== studentId);
        return this.teamRepo.save(team);
    }
    async setFacultyMentor(teamId, facultyId) {
        const team = await this.getOne(teamId);
        team.facultyMentorId = facultyId;
        team.status = project_team_entity_1.TeamStatus.ACTIVE;
        return this.teamRepo.save(team);
    }
    async submitOffer(teamId, partnerId, dto) {
        const team = await this.getOne(teamId);
        team.industryPartnerId = partnerId;
        team.industryOffer = dto;
        return this.teamRepo.save(team);
    }
    async browseProposals(domainTags, page = 1, limit = 20) {
        const qb = this.teamRepo
            .createQueryBuilder('t')
            .leftJoinAndSelect('t.problem', 'problem')
            .leftJoinAndSelect('t.milestones', 'milestones')
            .where('t.proposalSummary IS NOT NULL')
            .andWhere('t.industryPartnerId IS NULL')
            .orderBy('t.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (domainTags && domainTags.length > 0) {
            qb.andWhere('t.domainTags && :tags', { tags: domainTags });
        }
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async createMilestone(teamId, dto) {
        const team = await this.getOne(teamId);
        const count = await this.milestoneRepo.count({ where: { teamId } });
        const milestone = this.milestoneRepo.create({
            teamId: team.id,
            title: dto.title,
            description: dto.description,
            dueDate: dto.dueDate,
            status: milestone_entity_1.MilestoneStatus.TODO,
            orderIndex: count,
        });
        return this.milestoneRepo.save(milestone);
    }
    async updateMilestone(milestoneId, dto) {
        const milestone = await this.milestoneRepo.findOne({ where: { id: milestoneId } });
        if (!milestone)
            throw new common_1.NotFoundException('Milestone not found');
        Object.assign(milestone, dto);
        return this.milestoneRepo.save(milestone);
    }
    async deleteMilestone(milestoneId) {
        await this.milestoneRepo.delete(milestoneId);
    }
    async getKanban(teamId) {
        const milestones = await this.milestoneRepo.find({
            where: { teamId },
            order: { orderIndex: 'ASC' },
        });
        return {
            todo: milestones.filter((m) => m.status === milestone_entity_1.MilestoneStatus.TODO),
            inProgress: milestones.filter((m) => m.status === milestone_entity_1.MilestoneStatus.IN_PROGRESS),
            done: milestones.filter((m) => m.status === milestone_entity_1.MilestoneStatus.DONE),
            blocked: milestones.filter((m) => m.status === milestone_entity_1.MilestoneStatus.BLOCKED),
        };
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_team_entity_1.ProjectTeam)),
    __param(1, (0, typeorm_1.InjectRepository)(milestone_entity_1.Milestone)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TeamsService);
//# sourceMappingURL=teams.service.js.map