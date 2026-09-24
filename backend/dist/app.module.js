"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const configuration_1 = require("./config/configuration");
const user_entity_1 = require("./users/user.entity");
const problem_entity_1 = require("./problems/problem.entity");
const institution_entity_1 = require("./institutions/institution.entity");
const project_team_entity_1 = require("./teams/project-team.entity");
const milestone_entity_1 = require("./teams/milestone.entity");
const notification_entity_1 = require("./notifications/notification.entity");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const problems_module_1 = require("./problems/problems.module");
const institutions_module_1 = require("./institutions/institutions.module");
const teams_module_1 = require("./teams/teams.module");
const ai_routing_module_1 = require("./ai-routing/ai-routing.module");
const notifications_module_1 = require("./notifications/notifications.module");
const analytics_module_1 = require("./analytics/analytics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.appConfig, configuration_1.dbConfig, configuration_1.jwtConfig, configuration_1.redisConfig, configuration_1.otpConfig, configuration_1.aiConfig],
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('db.host'),
                    port: config.get('db.port'),
                    username: config.get('db.username'),
                    password: config.get('db.password'),
                    database: config.get('db.database'),
                    entities: [user_entity_1.User, problem_entity_1.Problem, institution_entity_1.Institution, project_team_entity_1.ProjectTeam, milestone_entity_1.Milestone, notification_entity_1.Notification],
                    synchronize: config.get('app.nodeEnv') !== 'production',
                    logging: config.get('app.nodeEnv') === 'development',
                }),
            }),
            bullmq_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    connection: {
                        host: config.get('redis.host'),
                        port: config.get('redis.port'),
                    },
                }),
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            problems_module_1.ProblemsModule,
            institutions_module_1.InstitutionsModule,
            teams_module_1.TeamsModule,
            ai_routing_module_1.AiRoutingModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map