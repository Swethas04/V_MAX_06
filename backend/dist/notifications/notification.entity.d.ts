import { User } from '../users/user.entity';
export declare enum NotificationType {
    STATUS_CHANGE = "status_change",
    TEAM_FORMED = "team_formed",
    UPVOTE = "upvote",
    OFFER_RECEIVED = "offer_received",
    MILESTONE_UPDATE = "milestone_update",
    SYSTEM = "system"
}
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    message: string;
    type: NotificationType;
    readStatus: boolean;
    referenceId: string | null;
    deepLink: string | null;
    createdAt: Date;
}
