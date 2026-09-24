"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRoutingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const ai_routing_service_1 = require("./ai-routing.service");
const ai_routing_processor_1 = require("./ai-routing.processor");
const embedding_service_1 = require("./embedding.service");
const problem_entity_1 = require("../problems/problem.entity");
const institution_entity_1 = require("../institutions/institution.entity");
const problems_module_1 = require("../problems/problems.module");
const problems_service_1 = require("../problems/problems.service");
let AiRoutingModule = class AiRoutingModule {
};
exports.AiRoutingModule = AiRoutingModule;
exports.AiRoutingModule = AiRoutingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([problem_entity_1.Problem, institution_entity_1.Institution]),
            bullmq_1.BullModule.registerQueue({ name: problems_service_1.AI_ROUTING_QUEUE }),
            (0, common_1.forwardRef)(() => problems_module_1.ProblemsModule),
        ],
        providers: [embedding_service_1.EmbeddingService, ai_routing_service_1.AiRoutingService, ai_routing_processor_1.AiRoutingProcessor],
        exports: [embedding_service_1.EmbeddingService, ai_routing_service_1.AiRoutingService],
    })
], AiRoutingModule);
//# sourceMappingURL=ai-routing.module.js.map