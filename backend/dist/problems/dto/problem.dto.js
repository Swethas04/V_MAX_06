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
exports.SupportProblemDto = exports.CheckSimilarDto = exports.ProblemsQueryDto = exports.CreateProblemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const problem_entity_1 = require("../problem.entity");
const class_transformer_1 = require("class-transformer");
class CreateProblemDto {
    constructor() {
        this.submitterType = problem_entity_1.SubmitterType.INDIVIDUAL;
    }
}
exports.CreateProblemDto = CreateProblemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Contaminated drinking water in Bokaro Village' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'The borewell water has turned yellowish since March...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: problem_entity_1.ProblemCategory }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(problem_entity_1.ProblemCategory),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: problem_entity_1.SubmitterType, default: problem_entity_1.SubmitterType.INDIVIDUAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(problem_entity_1.SubmitterType),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "submitterType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Chandankiyari Gram Panchayat' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "organizationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'JH-GP-BOK-042' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "registrationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ramesh Kumar Mahto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "submitterName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '9876543210' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "submitterPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 23.8 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateProblemDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 86.4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateProblemDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bokaro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Chandankiyari' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateProblemDto.prototype, "village", void 0);
class ProblemsQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
        this.radius = 50;
    }
}
exports.ProblemsQueryDto = ProblemsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProblemsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ProblemsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: problem_entity_1.ProblemCategory }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(problem_entity_1.ProblemCategory),
    __metadata("design:type", String)
], ProblemsQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: problem_entity_1.SubmitterType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(problem_entity_1.SubmitterType),
    __metadata("design:type", String)
], ProblemsQueryDto.prototype, "submitterType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 23.8 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProblemsQueryDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 86.4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProblemsQueryDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Radius in km' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], ProblemsQueryDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bokaro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProblemsQueryDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'water scarcity' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProblemsQueryDto.prototype, "q", void 0);
var check_similar_dto_1 = require("./check-similar.dto");
Object.defineProperty(exports, "CheckSimilarDto", { enumerable: true, get: function () { return check_similar_dto_1.CheckSimilarDto; } });
Object.defineProperty(exports, "SupportProblemDto", { enumerable: true, get: function () { return check_similar_dto_1.SupportProblemDto; } });
//# sourceMappingURL=problem.dto.js.map