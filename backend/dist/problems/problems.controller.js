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
exports.ProblemsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const problems_service_1 = require("./problems.service");
const problem_dto_1 = require("./dto/problem.dto");
const guards_1 = require("../auth/guards");
let ProblemsController = class ProblemsController {
    constructor(service) {
        this.service = service;
    }
    create(req, dto, files = []) {
        const mediaFiles = files.map((f) => ({
            type: f.mimetype.startsWith('audio') ? 'voice' : 'photo',
            url: `/uploads/${f.filename}`,
        }));
        const userId = req.user?.id || null;
        return this.service.create(userId, dto, mediaFiles);
    }
    checkSimilar(dto) {
        return this.service.checkSimilar(dto);
    }
    supportProblem(id, req, dto, files = []) {
        const mediaFiles = files.map((f) => ({
            type: f.mimetype.startsWith('audio') ? 'voice' : 'photo',
            url: `/uploads/${f.filename}`,
        }));
        const userId = req.user?.id || 'guest-citizen';
        return this.service.supportProblem(id, userId, dto?.message, mediaFiles);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findMine(req, page = 1, limit = 20) {
        return this.service.findMine(req.user.id, +page, +limit);
    }
    findNearby(lat, lng, radius = 50, page = 1, limit = 20) {
        return this.service.findNearby(+lat, +lng, +radius, +page, +limit);
    }
    findSimilar(q) {
        return this.service.findSimilar(q);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    upvote(id, req) {
        const userId = req.user?.id || 'guest-citizen';
        return this.service.upvote(id, userId);
    }
};
exports.ProblemsController = ProblemsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit a new societal problem (public submission with no login wall, or authenticated user)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (_, file, cb) => {
                cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, problem_dto_1.CreateProblemDto, Array]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('check-similar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Check for similar problems via pgvector and predict theme category (as-you-type debounced)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns duplicate analysis, similarity scores, and nearest theme classification.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [problem_dto_1.CheckSimilarDto]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "checkSimilar", null);
__decorate([
    (0, common_1.Post)(':id/support'),
    (0, common_1.UseGuards)(guards_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Add my voice to an existing problem instead of duplicating (upvotes + attaches evidence/media)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (_, file, cb) => {
                cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, problem_dto_1.SupportProblemDto, Array]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "supportProblem", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all problems with optional filters (admin/institution/public)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [problem_dto_1.ProblemsQueryDto]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get the authenticated citizen's own submissions" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Get problems near a coordinate (PostGIS radius)' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)('similar'),
    (0, swagger_1.ApiOperation)({ summary: 'Find semantically similar problems (query parameter backward compatibility)' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "findSimilar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single problem with full details' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/upvote'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Upvote / "Me Too" an existing problem' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProblemsController.prototype, "upvote", null);
exports.ProblemsController = ProblemsController = __decorate([
    (0, swagger_1.ApiTags)('Problems'),
    (0, common_1.Controller)('problems'),
    __metadata("design:paramtypes", [problems_service_1.ProblemsService])
], ProblemsController);
//# sourceMappingURL=problems.controller.js.map