import { Problem } from '../problems/problem.entity';
import { Institution } from '../institutions/institution.entity';
import { Milestone } from './milestone.entity';
export declare enum TeamStatus {
    FORMING = "forming",
    ACTIVE = "active",
    PROTOTYPING = "prototyping",
    PILOTING = "piloting",
    COMPLETED = "completed",
    PAUSED = "paused"
}
export declare class ProjectTeam {
    id: string;
    problemId: string;
    problem: Problem;
    institutionId: string;
    institution: Institution;
    studentIds: string[];
    facultyMentorId: string | null;
    industryPartnerId: string | null;
    status: TeamStatus;
    domainTags: string[];
    proposalSummary: string | null;
    industryOffer: {
        type: 'mentorship' | 'funding' | 'lab_access' | 'pilot_site';
        description: string;
        amount?: number;
    } | null;
    milestones: Milestone[];
    createdAt: Date;
    updatedAt: Date;
}
