import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Institution } from '../institutions/institution.entity';

export enum ProblemStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ASSIGNED = 'assigned',
  TEAM_FORMED = 'team_formed',
  PROTOTYPE = 'prototype',
  PILOTED = 'piloted',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ProblemCategory {
  WATER = 'water',
  ROADS = 'roads',
  AGRICULTURE = 'agriculture',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  ENVIRONMENT = 'environment',
  URBAN_INFRA = 'urban_infra',
  ACCESSIBILITY = 'accessibility',
  LIVELIHOOD = 'livelihood',
  OTHER = 'other',
}

export enum SubmitterType {
  INDIVIDUAL = 'individual',
  COMMUNITY_ORG = 'community_org',
  PRI = 'pri',
  ULB = 'ulb',
  GOVT_DEPARTMENT = 'govt_department',
}

@Entity('problems')
@Index(['status'])
@Index(['category'])
@Index(['submitterType'])
@Index(['submittedById'])
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ProblemCategory, default: ProblemCategory.OTHER })
  category: ProblemCategory;

  /** Manual override category set by admin/institution */
  @Column({ type: 'enum', enum: ProblemCategory, nullable: true })
  categoryManual: ProblemCategory | null;

  /** Location point (e.g. "lat,lng" or geojson text) */
  @Column({
    type: 'text',
    nullable: true,
  })
  location: string | null;

  @Column({ type: 'varchar', nullable: true, length: 120 })
  district: string | null;

  @Column({ type: 'varchar', nullable: true, length: 120 })
  village: string | null;

  /** JSON array of media URLs {type: photo|voice|doc, url: string, message?: string, addedBy?: string, addedAt?: string} */
  @Column({ type: 'jsonb', default: [] })
  media: {
    type: 'photo' | 'voice' | 'doc';
    url: string;
    message?: string;
    addedBy?: string;
    addedAt?: string;
  }[];

  @Column({ type: 'enum', enum: ProblemStatus, default: ProblemStatus.SUBMITTED })
  status: ProblemStatus;

  /** 0-100 AI-computed priority score */
  @Column({ type: 'float', default: 0 })
  priorityScore: number;

  @Column({ default: 0 })
  upvotes: number;

  /** 384-dim dense embedding vector stored as text/json */
  @Column({
    type: 'text',
    nullable: true,
    select: false,
    transformer: {
      to: (val: number[] | null): string | null => {
        if (!val) return null;
        return `[${val.join(',')}]`;
      },
      from: (val: string | number[] | null): number[] | null => {
        if (!val) return null;
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          return val.replace(/^\[|\]$/g, '').split(',').map(Number);
        }
        return null;
      },
    },
  })
  embedding: number[] | null;

  /** Points to the canonical problem if this is a duplicate */
  @Column({ type: 'varchar', nullable: true })
  duplicateOfId: string | null;

  @ManyToOne(() => Problem, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'duplicateOfId' })
  duplicateOf: Problem | null;

  @Column({ type: 'enum', enum: SubmitterType, default: SubmitterType.INDIVIDUAL })
  submitterType: SubmitterType;

  /** Organization name for non-individual submitters (NGO, SHG, Panchayat, ULB, Dept) */
  @Column({ type: 'varchar', nullable: true, length: 200 })
  organizationName: string | null;

  /** Official registration ID or ward/panchayat code */
  @Column({ type: 'varchar', nullable: true, length: 100 })
  registrationId: string | null;

  /** Contact name for submitter */
  @Column({ type: 'varchar', nullable: true, length: 120 })
  submitterName: string | null;

  /** Contact phone for submitter */
  @Column({ type: 'varchar', nullable: true, length: 20 })
  submitterPhone: string | null;

  @Column({ type: 'varchar', nullable: true })
  submittedById: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'submittedById' })
  submittedBy: User | null;

  /** Institution the problem was routed to */
  @Column({ type: 'varchar', nullable: true })
  assignedInstitutionId: string | null;

  @ManyToOne(() => Institution, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedInstitutionId' })
  assignedInstitution: Institution | null;

  /** AI routing result stored as JSON */
  @Column({ type: 'jsonb', nullable: true })
  aiRoutingResult: {
    category: string;
    priorityScore: number;
    duplicateCandidateIds: string[];
    suggestedInstitutionIds: string[];
    suggestedInstitutionsExplained?: {
      institutionId: string;
      institutionName: string;
      matchedOn: string[];
    }[];
  } | null;

  /** IDs of users who upvoted this problem */
  @Column({ type: 'text', array: true, default: [] })
  upvoterIds: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
