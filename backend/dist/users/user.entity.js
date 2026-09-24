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
exports.User = exports.SubmitterType = exports.Language = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const institution_entity_1 = require("../institutions/institution.entity");
var UserRole;
(function (UserRole) {
    UserRole["CITIZEN"] = "citizen";
    UserRole["STUDENT"] = "student";
    UserRole["FACULTY"] = "faculty";
    UserRole["INDUSTRY_PARTNER"] = "industry_partner";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var Language;
(function (Language) {
    Language["EN"] = "en";
    Language["HI"] = "hi";
})(Language || (exports.Language = Language = {}));
var SubmitterType;
(function (SubmitterType) {
    SubmitterType["INDIVIDUAL"] = "individual";
    SubmitterType["COMMUNITY_ORG"] = "community_org";
    SubmitterType["PRI"] = "pri";
    SubmitterType["ULB"] = "ulb";
    SubmitterType["GOVT_DEPARTMENT"] = "govt_department";
})(SubmitterType || (exports.SubmitterType = SubmitterType = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.CITIZEN }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SubmitterType, default: SubmitterType.INDIVIDUAL, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "submitterType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 200 }),
    __metadata("design:type", Object)
], User.prototype, "organizationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 100 }),
    __metadata("design:type", Object)
], User.prototype, "registrationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Language, default: Language.EN }),
    __metadata("design:type", String)
], User.prototype, "languagePref", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 120 }),
    __metadata("design:type", Object)
], User.prototype, "orgAffiliation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "institutionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institution_entity_1.Institution, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'institutionId' }),
    __metadata("design:type", Object)
], User.prototype, "institution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 300 }),
    __metadata("design:type", Object)
], User.prototype, "fcmToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", Object)
], User.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamptz' }),
    __metadata("design:type", Object)
], User.prototype, "otpExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['phone'], { unique: true })
], User);
//# sourceMappingURL=user.entity.js.map