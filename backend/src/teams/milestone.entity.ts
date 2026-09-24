import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectTeam } from './project-team.entity';

export enum MilestoneStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  BLOCKED = 'blocked',
}

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @ManyToOne(() => ProjectTeam, (team: ProjectTeam) => team.milestones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: ProjectTeam;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.TODO })
  status: MilestoneStatus;

  /** Array of attachment URLs */
  @Column({ type: 'text', array: true, default: [] })
  attachments: string[];

  /** Kanban column order index */
  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
