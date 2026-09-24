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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const teams_service_1 = require("./teams.service");
const teams_dto_1 = require("./dto/teams.dto");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
let TeamsController = class TeamsController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.createTeam(dto);
    }
    browseProposals(tags, page = 1, limit = 20) {
        const domainTags = tags ? tags.split(',') : undefined;
        return this.service.browseProposals(domainTags, +page, +limit);
    }
    getByInstitution(id) {
        return this.service.getByInstitution(id);
    }
    getOne(id) {
        return this.service.getOne(id);
    }
    addStudent(id, studentId) {
        return this.service.addStudent(id, studentId);
    }
    removeStudent(id, studentId) {
        return this.service.removeStudent(id, studentId);
    }
    setMentor(id, facultyId) {
        return this.service.setFacultyMentor(id, facultyId);
    }
    submitOffer(id, req, dto) {
        return this.service.submitOffer(id, req.user.id, dto);
    }
    getKanban(id) {
        return this.service.getKanban(id);
    }
    createMilestone(id, dto) {
        return this.service.createMilestone(id, dto);
    }
    updateMilestone(id, dto) {
        return this.service.updateMilestone(id, dto);
    }
    deleteMilestone(id) {
        return this.service.deleteMilestone(id);
    }
};
exports.TeamsController = TeamsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project team (faculty/admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [teams_dto_1.CreateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('proposals'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.INDUSTRY_PARTNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Browse open proposals (industry partner view)' }),
    __param(0, (0, common_1.Query)('tags')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "browseProposals", null);
__decorate([
    (0, common_1.Get)('institution/:institutionId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Get institution's teams" }),
    __param(0, (0, common_1.Param)('institutionId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "getByInstitution", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team details' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':id/students/:studentId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Add a student to team' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "addStudent", null);
__decorate([
    (0, common_1.Delete)(':id/students/:studentId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a student from team' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "removeStudent", null);
__decorate([
    (0, common_1.Patch)(':id/mentor/:facultyId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Set faculty mentor for a team' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('facultyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "setMentor", null);
__decorate([
    (0, common_1.Post)(':id/offer'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.INDUSTRY_PARTNER),
    (0, swagger_1.ApiOperation)({ summary: 'Submit industry partnership offer' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, teams_dto_1.IndustryOfferDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "submitOffer", null);
__decorate([
    (0, common_1.Get)(':id/kanban'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Kanban board (milestones grouped by status)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "getKanban", null);
__decorate([
    (0, common_1.Post)(':id/milestones'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.STUDENT, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a milestone for the project Kanban' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, teams_dto_1.CreateMilestoneDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "createMilestone", null);
__decorate([
    (0, common_1.Patch)('milestones/:milestoneId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.STUDENT, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update milestone status (Kanban drag)' }),
    __param(0, (0, common_1.Param)('milestoneId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, teams_dto_1.UpdateMilestoneDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "updateMilestone", null);
__decorate([
    (0, common_1.Delete)('milestones/:milestoneId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACULTY, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a milestone' }),
    __param(0, (0, common_1.Param)('milestoneId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "deleteMilestone", null);
exports.TeamsController = TeamsController = __decorate([
    (0, swagger_1.ApiTags)('Teams'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, common_1.Controller)('teams'),
    __metadata("design:paramtypes", [teams_service_1.TeamsService])
], TeamsController);
//# sourceMappingURL=teams.controller.js.map