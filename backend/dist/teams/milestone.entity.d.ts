import { ProjectTeam } from './project-team.entity';
export declare enum MilestoneStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done",
    BLOCKED = "blocked"
}
export declare class Milestone {
    id: string;
    teamId: string;
    team: ProjectTeam;
    title: string;
    description: string | null;
    dueDate: string | null;
    status: MilestoneStatus;
    attachments: string[];
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
}
