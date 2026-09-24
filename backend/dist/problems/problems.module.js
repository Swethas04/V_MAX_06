"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const problems_controller_1 = require("./problems.controller");
const problems_service_1 = require("./problems.service");
const problem_entity_1 = require("./problem.entity");
const ai_routing_module_1 = require("../ai-routing/ai-routing.module");
let ProblemsModule = class ProblemsModule {
};
exports.ProblemsModule = ProblemsModule;
exports.ProblemsModule = ProblemsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([problem_entity_1.Problem]),
            bullmq_1.BullModule.registerQueue({ name: problems_service_1.AI_ROUTING_QUEUE }),
            (0, common_1.forwardRef)(() => ai_routing_module_1.AiRoutingModule),
        ],
        controllers: [problems_controller_1.ProblemsController],
        providers: [problems_service_1.ProblemsService],
        exports: [problems_service_1.ProblemsService],
    })
], ProblemsModule);
//# sourceMappingURL=problems.module.js.map