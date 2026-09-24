import { Repository } from 'typeorm';
import { ProjectTeam } from './project-team.entity';
import { Milestone } from './milestone.entity';
import { CreateTeamDto, CreateMilestoneDto, UpdateMilestoneDto, IndustryOfferDto } from './dto/teams.dto';
export declare class TeamsService {
    private readonly teamRepo;
    private readonly milestoneRepo;
    constructor(teamRepo: Repository<ProjectTeam>, milestoneRepo: Repository<Milestone>);
    createTeam(dto: CreateTeamDto): Promise<ProjectTeam>;
    getByInstitution(institutionId: string): Promise<ProjectTeam[]>;
    getOne(id: string): Promise<ProjectTeam>;
    addStudent(teamId: string, studentId: string): Promise<ProjectTeam>;
    removeStudent(teamId: string, studentId: string): Promise<ProjectTeam>;
    setFacultyMentor(teamId: string, facultyId: string): Promise<ProjectTeam>;
    submitOffer(teamId: string, partnerId: string, dto: IndustryOfferDto): Promise<ProjectTeam>;
    browseProposals(domainTags?: string[], page?: number, limit?: number): Promise<{
        items: ProjectTeam[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createMilestone(teamId: string, dto: CreateMilestoneDto): Promise<Milestone>;
    updateMilestone(milestoneId: string, dto: UpdateMilestoneDto): Promise<Milestone>;
    deleteMilestone(milestoneId: string): Promise<void>;
    getKanban(teamId: string): Promise<{
        todo: Milestone[];
        inProgress: Milestone[];
        done: Milestone[];
        blocked: Milestone[];
    }>;
}
