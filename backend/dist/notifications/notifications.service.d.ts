import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';
export declare class NotificationsService {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<Notification>);
    create(data: {
        userId: string;
        message: string;
        type: NotificationType;
        referenceId?: string;
        deepLink?: string;
    }): Promise<Notification>;
    getForUser(userId: string, page?: number, limit?: number): Promise<{
        items: Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    markRead(notificationId: string, userId: string): Promise<void>;
    markAllRead(userId: string): Promise<void>;
    unreadCount(userId: string): Promise<number>;
    sendPush(fcmToken: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
    sendSms(phone: string, message: string): Promise<void>;
    notifyStatusChange(userId: string, problemTitle: string, newStatus: string, problemId: string, fcmToken?: string | null, phone?: string): Promise<void>;
}
