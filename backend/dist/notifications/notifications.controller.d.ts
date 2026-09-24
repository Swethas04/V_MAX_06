import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    getAll(req: any, page?: number, limit?: number): Promise<{
        items: import("./notification.entity").Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    unreadCount(req: any): Promise<{
        count: number;
    }>;
    markRead(id: string, req: any): Promise<void>;
    markAllRead(req: any): Promise<void>;
}
