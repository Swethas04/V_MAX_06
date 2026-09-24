import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Problem } from '../problems/problem.entity';
import { Institution } from '../institutions/institution.entity';
import { Milestone } from './milestone.entity';

export enum TeamStatus {
  FORMING = 'forming',
  ACTIVE = 'active',
  PROTOTYPING = 'prototyping',
  PILOTING = 'piloting',
  COMPLETED = 'completed',
  PAUSED = 'paused',
}

@Entity('project_teams')
export class ProjectTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  problemId: string;

  @ManyToOne(() => Problem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problemId' })
  problem: Problem;

  @Column()
  institutionId: string;

  @ManyToOne(() => Institution, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'institutionId' })
  institution: Institution;

  /** Array of student user IDs */
  @Column({ type: 'text', array: true, default: [] })
  studentIds: string[];

  /** Faculty mentor user ID */
  @Column({ type: 'varchar', nullable: true })
  facultyMentorId: string | null;

  /** Industry partner user ID */
  @Column({ type: 'varchar', nullable: true })
  industryPartnerId: string | null;

  @Column({ type: 'enum', enum: TeamStatus, default: TeamStatus.FORMING })
  status: TeamStatus;

  /** Domain tags for industry partner matching */
  @Column({ type: 'text', array: true, default: [] })
  domainTags: string[];

  /** Proposal description for industry partners */
  @Column({ type: 'text', nullable: true })
  proposalSummary: string | null;

  /** External funding/offer details stored as JSON */
  @Column({ type: 'jsonb', nullable: true })
  industryOffer: {
    type: 'mentorship' | 'funding' | 'lab_access' | 'pilot_site';
    description: string;
    amount?: number;
  } | null;

  @OneToMany(() => Milestone, (m: Milestone) => m.team, { cascade: true })
  milestones: Milestone[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
