import { MilestoneStatus } from '../milestone.entity';
export declare class CreateTeamDto {
    problemId: string;
    institutionId: string;
    studentIds?: string[];
    facultyMentorId?: string;
    domainTags?: string[];
    proposalSummary?: string;
}
export declare class CreateMilestoneDto {
    title: string;
    description?: string;
    dueDate?: string;
}
export declare class UpdateMilestoneDto {
    status?: MilestoneStatus;
    title?: string;
    dueDate?: string;
}
export declare class IndustryOfferDto {
    type: 'mentorship' | 'funding' | 'lab_access' | 'pilot_site';
    description: string;
    amount?: number;
}
