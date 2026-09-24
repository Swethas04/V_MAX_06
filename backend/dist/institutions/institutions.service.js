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
var InstitutionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const institution_entity_1 = require("./institution.entity");
let InstitutionsService = InstitutionsService_1 = class InstitutionsService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(InstitutionsService_1.name);
    }
    findAll() {
        return this.repo.find({ order: { problemsResolved: 'DESC' } });
    }
    findOne(id) {
        return this.repo.findOne({ where: { id } });
    }
    async getLeaderboard() {
        return this.repo.find({
            select: { id: true, name: true, shortName: true, city: true, problemsResolved: true, problemsActive: true },
            order: { problemsResolved: 'DESC' },
            take: 20,
        });
    }
    async matchByDomainTags(tags) {
        if (!tags.length)
            return this.findAll();
        return this.repo
            .createQueryBuilder('i')
            .where('i.research_areas && :tags', { tags })
            .orWhere('i.domain_tags && :tags', { tags })
            .orderBy('i.problems_resolved', 'DESC')
            .take(5)
            .getMany();
    }
};
exports.InstitutionsService = InstitutionsService;
exports.InstitutionsService = InstitutionsService = InstitutionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(institution_entity_1.Institution)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InstitutionsService);
//# sourceMappingURL=institutions.service.js.map