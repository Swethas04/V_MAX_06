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
exports.Problem = exports.SubmitterType = exports.ProblemCategory = exports.ProblemStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const institution_entity_1 = require("../institutions/institution.entity");
var ProblemStatus;
(function (ProblemStatus) {
    ProblemStatus["SUBMITTED"] = "submitted";
    ProblemStatus["UNDER_REVIEW"] = "under_review";
    ProblemStatus["ASSIGNED"] = "assigned";
    ProblemStatus["TEAM_FORMED"] = "team_formed";
    ProblemStatus["PROTOTYPE"] = "prototype";
    ProblemStatus["PILOTED"] = "piloted";
    ProblemStatus["RESOLVED"] = "resolved";
    ProblemStatus["REJECTED"] = "rejected";
})(ProblemStatus || (exports.ProblemStatus = ProblemStatus = {}));
var ProblemCategory;
(function (ProblemCategory) {
    ProblemCategory["WATER"] = "water";
    ProblemCategory["ROADS"] = "roads";
    ProblemCategory["AGRICULTURE"] = "agriculture";
    ProblemCategory["HEALTHCARE"] = "healthcare";
    ProblemCategory["EDUCATION"] = "education";
    ProblemCategory["ENVIRONMENT"] = "environment";
    ProblemCategory["URBAN_INFRA"] = "urban_infra";
    ProblemCategory["ACCESSIBILITY"] = "accessibility";
    ProblemCategory["LIVELIHOOD"] = "livelihood";
    ProblemCategory["OTHER"] = "other";
})(ProblemCategory || (exports.ProblemCategory = ProblemCategory = {}));
var SubmitterType;
(function (SubmitterType) {
    SubmitterType["INDIVIDUAL"] = "individual";
    SubmitterType["COMMUNITY_ORG"] = "community_org";
    SubmitterType["PRI"] = "pri";
    SubmitterType["ULB"] = "ulb";
    SubmitterType["GOVT_DEPARTMENT"] = "govt_department";
})(SubmitterType || (exports.SubmitterType = SubmitterType = {}));
let Problem = class Problem {
};
exports.Problem = Problem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Problem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Problem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Problem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProblemCategory, default: ProblemCategory.OTHER }),
    __metadata("design:type", String)
], Problem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProblemCategory, nullable: true }),
    __metadata("design:type", Object)
], Problem.prototype, "categoryManual", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Problem.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 120 }),
    __metadata("design:type", Object)
], Problem.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 120 }),
    __metadata("design:type", Object)
], Problem.prototype, "village", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Problem.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProblemStatus, default: ProblemStatus.SUBMITTED }),
    __metadata("design:type", String)
], Problem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Problem.prototype, "priorityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Problem.prototype, "upvotes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'vector',
        length: 384,
        nullable: true,
        select: false,
        transformer: {
            to: (val) => {
                if (!val)
                    return null;
                return `[${val.join(',')}]`;
            },
            from: (val) => {
                if (!val)
                    return null;
                if (Array.isArray(val))
                    return val;
                if (typeof val === 'string') {
                    return val.replace(/^\[|\]$/g, '').split(',').map(Number);
                }
                return null;
            },
        },
    }),
    __metadata("design:type", Object)
], Problem.prototype, "embedding", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Problem.prototype, "duplicateOfId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Problem, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'duplicateOfId' }),
    __metadata("design:type", Object)
], Problem.prototype, "duplicateOf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SubmitterType, default: SubmitterType.INDIVIDUAL }),
    __metadata("design:type", String)
], Problem.prototype, "submitterType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 200 }),
    __metadata("design:type", Object)
], Problem.prototype, "organizationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 100 }),
    __metadata("design:type", Object)
], Problem.prototype, "registrationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 120 }),
    __metadata("design:type", Object)
], Problem.prototype, "submitterName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 20 }),
    __metadata("design:type", Object)
], Problem.prototype, "submitterPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Problem.prototype, "submittedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'submittedById' }),
    __metadata("design:type", Object)
], Problem.prototype, "submittedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Problem.prototype, "assignedInstitutionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institution_entity_1.Institution, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedInstitutionId' }),
    __metadata("design:type", Object)
], Problem.prototype, "assignedInstitution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Problem.prototype, "aiRoutingResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Problem.prototype, "upvoterIds", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Problem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Problem.prototype, "updatedAt", void 0);
exports.Problem = Problem = __decorate([
    (0, typeorm_1.Entity)('problems'),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['category']),
    (0, typeorm_1.Index)(['submitterType']),
    (0, typeorm_1.Index)(['submittedById'])
], Problem);
//# sourceMappingURL=problem.entity.js.map