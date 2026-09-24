import { TeamsService } from './teams.service';
import { CreateTeamDto, CreateMilestoneDto, UpdateMilestoneDto, IndustryOfferDto } from './dto/teams.dto';
export declare class TeamsController {
    private readonly service;
    constructor(service: TeamsService);
    create(dto: CreateTeamDto): Promise<import("./project-team.entity").ProjectTeam>;
    browseProposals(tags?: string, page?: number, limit?: number): Promise<{
        items: import("./project-team.entity").ProjectTeam[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getByInstitution(id: string): Promise<import("./project-team.entity").ProjectTeam[]>;
    getOne(id: string): Promise<import("./project-team.entity").ProjectTeam>;
    addStudent(id: string, studentId: string): Promise<import("./project-team.entity").ProjectTeam>;
    removeStudent(id: string, studentId: string): Promise<import("./project-team.entity").ProjectTeam>;
    setMentor(id: string, facultyId: string): Promise<import("./project-team.entity").ProjectTeam>;
    submitOffer(id: string, req: any, dto: IndustryOfferDto): Promise<import("./project-team.entity").ProjectTeam>;
    getKanban(id: string): Promise<{
        todo: import("./milestone.entity").Milestone[];
        inProgress: import("./milestone.entity").Milestone[];
        done: import("./milestone.entity").Milestone[];
        blocked: import("./milestone.entity").Milestone[];
    }>;
    createMilestone(id: string, dto: CreateMilestoneDto): Promise<import("./milestone.entity").Milestone>;
    updateMilestone(id: string, dto: UpdateMilestoneDto): Promise<import("./milestone.entity").Milestone>;
    deleteMilestone(id: string): Promise<void>;
}
