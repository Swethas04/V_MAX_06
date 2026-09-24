import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum NotificationType {
  STATUS_CHANGE = 'status_change',
  TEAM_FORMED = 'team_formed',
  UPVOTE = 'upvote',
  OFFER_RECEIVED = 'offer_received',
  MILESTONE_UPDATE = 'milestone_update',
  SYSTEM = 'system',
}

@Entity('notifications')
@Index(['userId', 'readStatus'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Column({ default: false })
  readStatus: boolean;

  /** Related entity ID (e.g. problem ID, team ID) */
  @Column({ type: 'varchar', nullable: true })
  referenceId: string | null;

  /** Deep-link route for the mobile app */
  @Column({ type: 'varchar', nullable: true, length: 200 })
  deepLink: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
