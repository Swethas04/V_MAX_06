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
import { Institution } from '../institutions/institution.entity';

export enum UserRole {
  CITIZEN = 'citizen',
  STUDENT = 'student',
  FACULTY = 'faculty',
  INDUSTRY_PARTNER = 'industry_partner',
  ADMIN = 'admin',
}

export enum Language {
  EN = 'en',
  HI = 'hi',
}

export enum SubmitterType {
  INDIVIDUAL = 'individual',
  COMMUNITY_ORG = 'community_org',
  PRI = 'pri',
  ULB = 'ulb',
  GOVT_DEPARTMENT = 'govt_department',
}

@Entity('users')
@Index(['phone'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 15, unique: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CITIZEN })
  role: UserRole;

  @Column({ type: 'enum', enum: SubmitterType, default: SubmitterType.INDIVIDUAL, nullable: true })
  submitterType: SubmitterType;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  organizationName: string | null;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  registrationId: string | null;

  @Column({ type: 'enum', enum: Language, default: Language.EN })
  languagePref: Language;

  @Column({ type: 'varchar', nullable: true, length: 120 })
  orgAffiliation: string | null;

  @Column({ type: 'varchar', nullable: true })
  institutionId: string | null;

  @ManyToOne(() => Institution, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'institutionId' })
  institution: Institution | null;

  /** FCM device token for push notifications */
  @Column({ type: 'varchar', nullable: true, length: 300 })
  fcmToken: string | null;

  /** Temporary OTP hash stored during login flow */
  @Column({ type: 'varchar', nullable: true, length: 10 })
  otpCode: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  otpExpiresAt: Date | null;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
