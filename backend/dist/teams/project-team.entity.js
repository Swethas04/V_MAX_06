"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTeam = exports.TeamStatus = void 0;
const typeorm_1 = require("typeorm");
const problem_entity_1 = require("../problems/problem.entity");
const institution_entity_1 = require("../institutions/institution.entity");
const milestone_entity_1 = require("./milestone.entity");
var TeamStatus;
(function (TeamStatus) {
    TeamStatus["FORMING"] = "forming";
    TeamStatus["ACTIVE"] = "active";
    TeamStatus["PROTOTYPING"] = "prototyping";
    TeamStatus["PILOTING"] = "piloting";
    TeamStatus["COMPLETED"] = "completed";
    TeamStatus["PAUSED"] = "paused";
})(TeamStatus || (exports.TeamStatus = TeamStatus = {}));
let ProjectTeam = class ProjectTeam {
};
exports.ProjectTeam = ProjectTeam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectTeam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectTeam.prototype, "problemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => problem_entity_1.Problem, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'problemId' }),
    __metadata("design:type", problem_entity_1.Problem)
], ProjectTeam.prototype, "problem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectTeam.prototype, "institutionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institution_entity_1.Institution, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'institutionId' }),
    __metadata("design:type", institution_entity_1.Institution)
], ProjectTeam.prototype, "institution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], ProjectTeam.prototype, "studentIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], ProjectTeam.prototype, "facultyMentorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], ProjectTeam.prototype, "industryPartnerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TeamStatus, default: TeamStatus.FORMING }),
    __metadata("design:type", String)
], ProjectTeam.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], ProjectTeam.prototype, "domainTags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ProjectTeam.prototype, "proposalSummary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProjectTeam.prototype, "industryOffer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => milestone_entity_1.Milestone, (m) => m.team, { cascade: true }),
    __metadata("design:type", Array)
], ProjectTeam.prototype, "milestones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ProjectTeam.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ProjectTeam.prototype, "updatedAt", void 0);
exports.ProjectTeam = ProjectTeam = __decorate([
    (0, typeorm_1.Entity)('project_teams')
], ProjectTeam);
//# sourceMappingURL=project-team.entity.js.map