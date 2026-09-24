import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare const EMBEDDING_DIMENSION = 384;
export declare class EmbeddingService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private pipelineInstance;
    private isPipelineLoading;
    private pipelineLoadPromise;
    private mode;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    private initTransformersPipeline;
    embedText(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
    private embedWithTransformers;
    private embedWithGemini;
    private embedWithOpenAI;
    private embedWithCustomEndpoint;
    fallbackVector(text: string): number[];
    cosineSimilarity(a: number[], b: number[]): number;
    normalizeVector(v: number[]): number[];
    private fitDimension;
    private hashString;
}
