import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification) private readonly repo: Repository<Notification>,
  ) {}

  /** Create an in-app notification */
  async create(data: {
    userId: string;
    message: string;
    type: NotificationType;
    referenceId?: string;
    deepLink?: string;
  }): Promise<Notification> {
    const notif = this.repo.create(data);
    return this.repo.save(notif);
  }

  /** Get unread notifications for a user */
  async getForUser(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  /** Mark notification(s) as read */
  async markRead(notificationId: string, userId: string): Promise<void> {
    await this.repo.update({ id: notificationId, userId }, { readStatus: true });
  }

  /** Mark all as read for a user */
  async markAllRead(userId: string): Promise<void> {
    await this.repo.update({ userId, readStatus: false }, { readStatus: true });
  }

  /** Get unread count */
  async unreadCount(userId: string): Promise<number> {
    return this.repo.count({ where: { userId, readStatus: false } });
  }

  /**
   * Send push notification via FCM.
   * SWAP POINT: Replace stub with firebase-admin SDK call.
   */
  async sendPush(fcmToken: string, title: string, body: string, data?: Record<string, string>): Promise<void> {
    this.logger.log(`[FCM STUB] Token: ${fcmToken.slice(0, 10)}... | ${title}: ${body}`);
    // TODO: firebase-admin SDK
    // await admin.messaging().send({ token: fcmToken, notification: { title, body }, data });
  }

  /**
   * Send SMS notification.
   * SWAP POINT: Replace stub with MSG91/Twilio SDK call.
   */
  async sendSms(phone: string, message: string): Promise<void> {
    this.logger.log(`[SMS STUB] To: ${phone} | ${message}`);
    // TODO: MSG91 SDK
    // await msg91.sendSMS({ mobiles: phone, message, sender: 'SMDHAN' });
  }

  /** Notify on problem status change (called by ProblemsService) */
  async notifyStatusChange(
    userId: string,
    problemTitle: string,
    newStatus: string,
    problemId: string,
    fcmToken?: string | null,
    phone?: string,
  ): Promise<void> {
    const statusLabels: Record<string, string> = {
      under_review: 'is Under Review',
      assigned: 'has been Assigned to a University',
      team_formed: 'has a Team formed',
      prototype: 'is in Prototype stage',
      piloted: 'is being Piloted',
      resolved: 'has been Resolved! 🎉',
      rejected: 'was not accepted',
    };

    const label = statusLabels[newStatus] || `status changed to ${newStatus}`;
    const message = `Your problem "${problemTitle.slice(0, 50)}" ${label}.`;

    await this.create({
      userId,
      message,
      type: NotificationType.STATUS_CHANGE,
      referenceId: problemId,
      deepLink: `/problems/${problemId}`,
    });

    if (fcmToken) {
      await this.sendPush(fcmToken, 'Samadhan Setu Update', message, {
        problemId,
        status: newStatus,
      });
    } else if (phone) {
      await this.sendSms(phone, `Samadhan Setu: ${message}`);
    }
  }
}
