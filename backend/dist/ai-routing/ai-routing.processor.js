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
var AiRoutingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRoutingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const ai_routing_service_1 = require("./ai-routing.service");
const problems_service_1 = require("../problems/problems.service");
let AiRoutingProcessor = AiRoutingProcessor_1 = class AiRoutingProcessor extends bullmq_1.WorkerHost {
    constructor(aiService, problemsService) {
        super();
        this.aiService = aiService;
        this.problemsService = problemsService;
        this.logger = new common_1.Logger(AiRoutingProcessor_1.name);
    }
    async process(job) {
        const { problemId } = job.data;
        this.logger.log(`Processing AI routing job for problem: ${problemId}`);
        try {
            const result = await this.aiService.routeProblem(problemId);
            await this.problemsService.saveAiResult(problemId, result);
            this.logger.log(`AI routing complete for ${problemId}: category=${result.category}, priority=${result.priorityScore}`);
        }
        catch (err) {
            this.logger.error(`AI routing failed for ${problemId}: ${err.message}`);
            throw err;
        }
    }
};
exports.AiRoutingProcessor = AiRoutingProcessor;
exports.AiRoutingProcessor = AiRoutingProcessor = AiRoutingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(problems_service_1.AI_ROUTING_QUEUE),
    __metadata("design:paramtypes", [ai_routing_service_1.AiRoutingService,
        problems_service_1.ProblemsService])
], AiRoutingProcessor);
//# sourceMappingURL=ai-routing.processor.js.map