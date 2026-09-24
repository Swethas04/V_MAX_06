"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = exports.EMBEDDING_DIMENSION = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
exports.EMBEDDING_DIMENSION = 384;
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmbeddingService_1.name);
        this.pipelineInstance = null;
        this.isPipelineLoading = false;
        this.pipelineLoadPromise = null;
        this.mode = 'transformers';
    }
    async onModuleInit() {
        const configuredMode = this.config.get('ai.embeddingMode') || process.env.AI_EMBEDDING_MODE;
        const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
        const hasOpenAI = !!(process.env.OPENAI_API_KEY || this.config.get('ai.openaiApiKey'));
        const hasCustomUrl = !!process.env.AI_EMBEDDING_URL;
        if (configuredMode === 'gemini' || (!configuredMode && hasGemini)) {
            this.mode = 'gemini';
            this.logger.log('✨ Using Gemini Embeddings API for semantic representation');
        }
        else if (configuredMode === 'openai' || (!configuredMode && hasOpenAI)) {
            this.mode = 'openai';
            this.logger.log('✨ Using OpenAI Embeddings API (text-embedding-3-small) for semantic representation');
        }
        else if (hasCustomUrl || configuredMode === 'custom') {
            this.mode = 'custom';
            this.logger.log(`✨ Using Custom Self-Hosted Embedding endpoint: ${process.env.AI_EMBEDDING_URL}`);
        }
        else {
            this.mode = 'transformers';
            this.logger.log('✨ Using multilingual Sentence Transformer (@xenova/transformers 384-dim)');
            this.initTransformersPipeline().catch((err) => {
                this.logger.warn(`Transformers pipeline pre-warm notice: ${err.message}. Fallback ready.`);
            });
        }
    }
    async initTransformersPipeline() {
        if (this.pipelineInstance)
            return this.pipelineInstance;
        if (this.pipelineLoadPromise)
            return this.pipelineLoadPromise;
        this.isPipelineLoading = true;
        this.pipelineLoadPromise = (async () => {
            try {
                const { pipeline } = await Promise.resolve().then(() => __importStar(require('@xenova/transformers')));
                const modelName = process.env.TRANSFORMER_MODEL_NAME || 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
                this.logger.log(`Loading Sentence Transformer pipeline: ${modelName}...`);
                const extractor = await pipeline('feature-extraction', modelName);
                this.pipelineInstance = extractor;
                this.isPipelineLoading = false;
                this.logger.log('✅ Multilingual Sentence Transformer pipeline loaded successfully.');
                return extractor;
            }
            catch (error) {
                this.isPipelineLoading = false;
                this.logger.warn(`Could not load local transformer model: ${error.message}`);
                throw error;
            }
        })();
        return this.pipelineLoadPromise;
    }
    async embedText(text) {
        const cleaned = (text || '').trim();
        if (!cleaned) {
            return new Array(exports.EMBEDDING_DIMENSION).fill(0);
        }
        try {
            if (this.mode === 'gemini') {
                return await this.embedWithGemini(cleaned);
            }
            else if (this.mode === 'openai') {
                return await this.embedWithOpenAI(cleaned);
            }
            else if (this.mode === 'custom') {
                return await this.embedWithCustomEndpoint(cleaned);
            }
            else {
                return await this.embedWithTransformers(cleaned);
            }
        }
        catch (err) {
            this.logger.warn(`Embedding provider '${this.mode}' failed (${err.message}), using fallback semantic vectorizer.`);
            return this.fallbackVector(cleaned);
        }
    }
    async embedBatch(texts) {
        const results = [];
        for (const text of texts) {
            results.push(await this.embedText(text));
        }
        return results;
    }
    async embedWithTransformers(text) {
        const extractor = await this.initTransformersPipeline();
        const output = await extractor(text, {
            pooling: 'mean',
            normalize: true,
        });
        const rawArray = Array.from(output.data);
        return this.normalizeVector(this.fitDimension(rawArray, exports.EMBEDDING_DIMENSION));
    }
    async embedWithGemini(text) {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey)
            throw new Error('GEMINI_API_KEY is not set');
        const model = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: `models/${model}`,
                content: { parts: [{ text }] },
                outputDimensionality: exports.EMBEDDING_DIMENSION,
            }),
        });
        if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Gemini embedding API returned ${res.status}: ${errBody}`);
        }
        const data = await res.json();
        const values = data.embedding?.values || [];
        if (values.length === 0)
            throw new Error('Empty embedding from Gemini');
        return this.normalizeVector(this.fitDimension(values, exports.EMBEDDING_DIMENSION));
    }
    async embedWithOpenAI(text) {
        const apiKey = process.env.OPENAI_API_KEY || this.config.get('ai.openaiApiKey');
        if (!apiKey)
            throw new Error('OPENAI_API_KEY is not set');
        const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
        const res = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                input: text,
                model,
                dimensions: exports.EMBEDDING_DIMENSION,
            }),
        });
        if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`OpenAI embedding API returned ${res.status}: ${errBody}`);
        }
        const data = await res.json();
        const values = data.data?.[0]?.embedding || [];
        if (values.length === 0)
            throw new Error('Empty embedding from OpenAI');
        return this.normalizeVector(this.fitDimension(values, exports.EMBEDDING_DIMENSION));
    }
    async embedWithCustomEndpoint(text) {
        const endpoint = process.env.AI_EMBEDDING_URL;
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, inputs: text }),
        });
        if (!res.ok) {
            throw new Error(`Custom embedding endpoint failed with status ${res.status}`);
        }
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data.embedding || data.vector || [];
        return this.normalizeVector(this.fitDimension(raw, exports.EMBEDDING_DIMENSION));
    }
    fallbackVector(text) {
        const vector = new Array(exports.EMBEDDING_DIMENSION).fill(0);
        const normalized = text.toLowerCase().normalize('NFKD');
        const tokens = normalized.split(/\s+/).filter(Boolean);
        for (const token of tokens) {
            let h1 = this.hashString(token);
            let idx1 = Math.abs(h1) % exports.EMBEDDING_DIMENSION;
            vector[idx1] += 1.0;
            const padded = `^${token}$`;
            for (let i = 0; i <= padded.length - 3; i++) {
                const tri = padded.slice(i, i + 3);
                let h2 = this.hashString(tri);
                let idx2 = Math.abs(h2) % exports.EMBEDDING_DIMENSION;
                vector[idx2] += 0.5;
            }
        }
        return this.normalizeVector(vector);
    }
    cosineSimilarity(a, b) {
        if (!a || !b || a.length === 0 || b.length === 0)
            return 0;
        const len = Math.min(a.length, b.length);
        let dot = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < len; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA === 0 || normB === 0)
            return 0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    normalizeVector(v) {
        let sumSq = 0;
        for (let i = 0; i < v.length; i++)
            sumSq += v[i] * v[i];
        const mag = Math.sqrt(sumSq);
        if (mag === 0)
            return v;
        return v.map((x) => x / mag);
    }
    fitDimension(vec, dim) {
        if (vec.length === dim)
            return vec;
        if (vec.length > dim)
            return vec.slice(0, dim);
        const padded = [...vec];
        while (padded.length < dim)
            padded.push(0);
        return padded;
    }
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }
};
exports.EmbeddingService = EmbeddingService;
exports.EmbeddingService = EmbeddingService = EmbeddingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmbeddingService);
//# sourceMappingURL=embedding.service.js.map