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
exports.Milestone = exports.MilestoneStatus = void 0;
const typeorm_1 = require("typeorm");
const project_team_entity_1 = require("./project-team.entity");
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["TODO"] = "todo";
    MilestoneStatus["IN_PROGRESS"] = "in_progress";
    MilestoneStatus["DONE"] = "done";
    MilestoneStatus["BLOCKED"] = "blocked";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
let Milestone = class Milestone {
};
exports.Milestone = Milestone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Milestone.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Milestone.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_team_entity_1.ProjectTeam, (team) => team.milestones, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'teamId' }),
    __metadata("design:type", project_team_entity_1.ProjectTeam)
], Milestone.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Milestone.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Milestone.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Milestone.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.TODO }),
    __metadata("design:type", String)
], Milestone.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Milestone.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Milestone.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Milestone.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Milestone.prototype, "updatedAt", void 0);
exports.Milestone = Milestone = __decorate([
    (0, typeorm_1.Entity)('milestones')
], Milestone);
//# sourceMappingURL=milestone.entity.js.map