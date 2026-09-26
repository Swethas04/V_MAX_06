import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Config
import {
  appConfig,
  dbConfig,
  jwtConfig,
  redisConfig,
  otpConfig,
  aiConfig,
} from './config/configuration';

// Entities
import { User } from './users/user.entity';
import { Problem } from './problems/problem.entity';
import { Institution } from './institutions/institution.entity';
import { ProjectTeam } from './teams/project-team.entity';
import { Milestone } from './teams/milestone.entity';
import { Notification } from './notifications/notification.entity';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProblemsModule } from './problems/problems.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { TeamsModule } from './teams/teams.module';
import { AiRoutingModule } from './ai-routing/ai-routing.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig, redisConfig, otpConfig, aiConfig],
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('db.host'),
        port: config.get<number>('db.port'),
        username: config.get<string>('db.username'),
        password: config.get<string>('db.password'),
        database: config.get<string>('db.database'),
        entities: [User, Problem, Institution, ProjectTeam, Milestone, Notification],
        synchronize: config.get<string>('app.nodeEnv') === 'development',
        logging: config.get<string>('app.nodeEnv') === 'development',
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    AuthModule,
    UsersModule,
    ProblemsModule,
    InstitutionsModule,
    TeamsModule,
    AiRoutingModule,
    NotificationsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
