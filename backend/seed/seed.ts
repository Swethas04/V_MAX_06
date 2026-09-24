import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Institution } from '../src/institutions/institution.entity';
import { User } from '../src/users/user.entity';
import { Problem } from '../src/problems/problem.entity';
import { ProjectTeam, TeamStatus } from '../src/teams/project-team.entity';
import { Milestone, MilestoneStatus } from '../src/teams/milestone.entity';
import { INSTITUTIONS, SEED_USERS, SEED_PROBLEMS } from './seed-data';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'samadhan',
  password: process.env.DB_PASSWORD || 'samadhan_secret',
  database: process.env.DB_NAME || 'samadhan_setu',
  entities: [Institution, User, Problem, ProjectTeam, Milestone],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Connecting to database...');
  await AppDataSource.initialize();

  const institutionRepo = AppDataSource.getRepository(Institution);
  const userRepo = AppDataSource.getRepository(User);
  const problemRepo = AppDataSource.getRepository(Problem);
  const teamRepo = AppDataSource.getRepository(ProjectTeam);
  const milestoneRepo = AppDataSource.getRepository(Milestone);

  // ─── Institutions ─────────────────────────────────────────
  console.log('🏛️  Seeding institutions...');
  const institutions: Institution[] = [];
  for (const data of INSTITUTIONS) {
    const existing = await institutionRepo.findOne({ where: { name: data.name! } });
    if (!existing) {
      const inst = institutionRepo.create(data);
      institutions.push(await institutionRepo.save(inst));
    } else {
      institutions.push(existing);
    }
  }
  console.log(`   ✅ ${institutions.length} institutions seeded`);

  // ─── Users ────────────────────────────────────────────────
  console.log('👤 Seeding users...');
  const users: User[] = [];
  for (const data of SEED_USERS) {
    const existing = await userRepo.findOne({ where: { phone: data.phone! } });
    if (!existing) {
      const u = userRepo.create({ ...data, institutionId: null });
      users.push(await userRepo.save(u));
    } else {
      users.push(existing);
    }
  }
  console.log(`   ✅ ${users.length} users seeded`);

  // ─── Problems ─────────────────────────────────────────────
  console.log('📋 Seeding problems...');
  const citizenIds = users.filter(u => ['citizen', 'admin'].includes(u.role)).map(u => u.id);
  const problemDataList = SEED_PROBLEMS(citizenIds);
  const problems: Problem[] = [];

  for (const data of problemDataList) {
    const { latitude, longitude, ...rest } = data;
    const prob = problemRepo.create(rest as any);

    const saved: Problem = (await problemRepo.save(prob as any)) as any;

    if (latitude && longitude) {
      await AppDataSource.query(
        `UPDATE problems SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
        [longitude, latitude, saved.id],
      );
    }
    problems.push(saved);
  }
  console.log(`   ✅ ${problems.length} problems seeded`);

  // ─── Project Teams ────────────────────────────────────────
  console.log('👥 Seeding project teams...');

  const faculty = users.find(u => u.role === 'faculty');
  const students = users.filter(u => u.role === 'student');
  const industryPartner = users.find(u => u.role === 'industry_partner');
  const iitIsm = institutions[0];
  const nitJsr = institutions[2];

  // Team 1: Water contamination problem at IIT ISM
  const team1 = teamRepo.create({
    problemId: problems[0].id,
    institutionId: iitIsm.id,
    studentIds: students.slice(0, 2).map(s => s.id),
    facultyMentorId: faculty?.id,
    industryPartnerId: industryPartner?.id,
    status: TeamStatus.ACTIVE,
    domainTags: ['water', 'environmental engineering', 'IoT sensors'],
    proposalSummary: 'Install low-cost IoT water quality sensors with solar power. Real-time pH, TDS, and turbidity monitoring. Community alert system via SMS for 500 households.',
    industryOffer: {
      type: 'funding',
      description: 'Tata Steel Foundation CSR grant for pilot deployment',
      amount: 500000,
    },
  });
  const savedTeam1 = await teamRepo.save(team1);

  await milestoneRepo.save([
    milestoneRepo.create({ teamId: savedTeam1.id, title: 'Literature survey and sensor selection', status: MilestoneStatus.DONE, dueDate: '2026-10-15', orderIndex: 0 }),
    milestoneRepo.create({ teamId: savedTeam1.id, title: 'Prototype sensor node assembly', status: MilestoneStatus.DONE, dueDate: '2026-11-01', orderIndex: 1 }),
    milestoneRepo.create({ teamId: savedTeam1.id, title: 'Field deployment in Chandankiyari village', status: MilestoneStatus.IN_PROGRESS, dueDate: '2026-11-20', orderIndex: 2 }),
    milestoneRepo.create({ teamId: savedTeam1.id, title: 'Data analysis and government report submission', status: MilestoneStatus.TODO, dueDate: '2026-12-15', orderIndex: 3 }),
  ]);

  // Team 2: Crop failure / irrigation at NIT Jamshedpur
  const team2 = teamRepo.create({
    problemId: problems[2].id,
    institutionId: nitJsr.id,
    studentIds: students.slice(1, 3).map(s => s.id),
    facultyMentorId: faculty?.id,
    status: TeamStatus.PROTOTYPING,
    domainTags: ['agriculture', 'irrigation', 'solar', 'rural tech'],
    proposalSummary: 'Design a low-cost drip irrigation system powered by solar energy for 50-acre pilot. Train 20 farmer families on maintenance. Integrate with district agricultural office advisory system.',
  });
  const savedTeam2 = await teamRepo.save(team2);

  await milestoneRepo.save([
    milestoneRepo.create({ teamId: savedTeam2.id, title: 'Soil and water availability survey in Pakur', status: MilestoneStatus.DONE, dueDate: '2026-09-30', orderIndex: 0 }),
    milestoneRepo.create({ teamId: savedTeam2.id, title: 'Drip irrigation prototype design', status: MilestoneStatus.IN_PROGRESS, dueDate: '2026-10-31', orderIndex: 1 }),
    milestoneRepo.create({ teamId: savedTeam2.id, title: 'Solar pump integration and testing', status: MilestoneStatus.TODO, dueDate: '2026-11-30', orderIndex: 2 }),
    milestoneRepo.create({ teamId: savedTeam2.id, title: 'Farmer training and handover', status: MilestoneStatus.TODO, dueDate: '2026-12-31', orderIndex: 3 }),
  ]);

  console.log(`   ✅ 2 project teams with milestones seeded`);
  console.log('\n🎉 Seed complete! Your app is demo-ready.\n');
  console.log('Demo credentials (OTP login, any 6-digit OTP):');
  console.log('  👤 Citizen:         +91 9001000001 (Ramesh Kumar)');
  console.log('  🎓 Faculty:         +91 9001000004 (Dr. Priya Sharma)');
  console.log('  📚 Student:         +91 9001000005 (Vikram Pandey)');
  console.log('  🏭 Industry:        +91 9001000007 (Ravi Tata)');
  console.log('  🔑 Admin:           +91 9000000000 (Admin User)\n');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
