import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('institutions')
export class Institution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shortName: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string | null;

  /** Array of department names */
  @Column({ type: 'text', array: true, default: [] })
  departments: string[];

  /** Research focus areas / tags */
  @Column({ type: 'text', array: true, default: [] })
  researchAreas: string[];

  /** Names/descriptions of incubation cells */
  @Column({ type: 'text', array: true, default: [] })
  incubationCells: string[];

  /** Domain tags for matching with industry partners */
  @Column({ type: 'text', array: true, default: [] })
  domainTags: string[];

  @Column({ default: 0 })
  problemsResolved: number;

  @Column({ default: 0 })
  problemsActive: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
