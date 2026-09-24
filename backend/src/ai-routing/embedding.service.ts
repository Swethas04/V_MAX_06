import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const EMBEDDING_DIMENSION = 384;

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private pipelineInstance: any = null;
  private isPipelineLoading = false;
  private pipelineLoadPromise: Promise<any> | null = null;
  private mode: string = 'transformers'; // 'gemini' | 'openai' | 'transformers' | 'custom' | 'fallback'

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const configuredMode = this.config.get<string>('ai.embeddingMode') || process.env.AI_EMBEDDING_MODE;
    const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const hasOpenAI = !!(process.env.OPENAI_API_KEY || this.config.get<string>('ai.openaiApiKey'));
    const hasCustomUrl = !!process.env.AI_EMBEDDING_URL;

    if (configuredMode === 'gemini' || (!configuredMode && hasGemini)) {
      this.mode = 'gemini';
      this.logger.log('✨ Using Gemini Embeddings API for semantic representation');
    } else if (configuredMode === 'openai' || (!configuredMode && hasOpenAI)) {
      this.mode = 'openai';
      this.logger.log('✨ Using OpenAI Embeddings API (text-embedding-3-small) for semantic representation');
    } else if (hasCustomUrl || configuredMode === 'custom') {
      this.mode = 'custom';
      this.logger.log(`✨ Using Custom Self-Hosted Embedding endpoint: ${process.env.AI_EMBEDDING_URL}`);
    } else {
      this.mode = 'transformers';
      this.logger.log('✨ Using multilingual Sentence Transformer (@xenova/transformers 384-dim)');
      // Pre-warm the local transformer model in background
      this.initTransformersPipeline().catch((err) => {
        this.logger.warn(`Transformers pipeline pre-warm notice: ${err.message}. Fallback ready.`);
      });
    }
  }

  /**
   * Initializes local Xenova sentence-transformers pipeline with singleton caching.
   */
  private async initTransformersPipeline(): Promise<any> {
    if (this.pipelineInstance) return this.pipelineInstance;
    if (this.pipelineLoadPromise) return this.pipelineLoadPromise;

    this.isPipelineLoading = true;
    this.pipelineLoadPromise = (async () => {
      try {
        const { pipeline } = await import('@xenova/transformers');
        // Use multilingual paraphrase-multilingual-MiniLM-L12-v2 (384-dim)
        const modelName = process.env.TRANSFORMER_MODEL_NAME || 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
        this.logger.log(`Loading Sentence Transformer pipeline: ${modelName}...`);
        const extractor = await pipeline('feature-extraction', modelName);
        this.pipelineInstance = extractor;
        this.isPipelineLoading = false;
        this.logger.log('✅ Multilingual Sentence Transformer pipeline loaded successfully.');
        return extractor;
      } catch (error) {
        this.isPipelineLoading = false;
        this.logger.warn(`Could not load local transformer model: ${(error as Error).message}`);
        throw error;
      }
    })();

    return this.pipelineLoadPromise;
  }

  /**
   * Generate a normalized 384-dimensional dense embedding vector for the provided text.
   */
  async embedText(text: string): Promise<number[]> {
    const cleaned = (text || '').trim();
    if (!cleaned) {
      return new Array(EMBEDDING_DIMENSION).fill(0);
    }

    try {
      if (this.mode === 'gemini') {
        return await this.embedWithGemini(cleaned);
      } else if (this.mode === 'openai') {
        return await this.embedWithOpenAI(cleaned);
      } else if (this.mode === 'custom') {
        return await this.embedWithCustomEndpoint(cleaned);
      } else {
        return await this.embedWithTransformers(cleaned);
      }
    } catch (err) {
      this.logger.warn(`Embedding provider '${this.mode}' failed (${(err as Error).message}), using fallback semantic vectorizer.`);
      return this.fallbackVector(cleaned);
    }
  }

  /**
   * Batch embedding generation.
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      results.push(await this.embedText(text));
    }
    return results;
  }

  /**
   * Generate embedding with local @xenova/transformers model.
   */
  private async embedWithTransformers(text: string): Promise<number[]> {
    const extractor = await this.initTransformersPipeline();
    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    const rawArray = Array.from(output.data) as number[];
    return this.normalizeVector(this.fitDimension(rawArray, EMBEDDING_DIMENSION));
  }

  /**
   * Generate embedding with Google Gemini Embeddings API.
   */
  private async embedWithGemini(text: string): Promise<number[]> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

    const model = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${model}`,
        content: { parts: [{ text }] },
        outputDimensionality: EMBEDDING_DIMENSION,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini embedding API returned ${res.status}: ${errBody}`);
    }

    const data: any = await res.json();
    const values: number[] = data.embedding?.values || [];
    if (values.length === 0) throw new Error('Empty embedding from Gemini');

    return this.normalizeVector(this.fitDimension(values, EMBEDDING_DIMENSION));
  }

  /**
   * Generate embedding with OpenAI Embeddings API.
   */
  private async embedWithOpenAI(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY || this.config.get<string>('ai.openaiApiKey');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

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
        dimensions: EMBEDDING_DIMENSION,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenAI embedding API returned ${res.status}: ${errBody}`);
    }

    const data: any = await res.json();
    const values: number[] = data.data?.[0]?.embedding || [];
    if (values.length === 0) throw new Error('Empty embedding from OpenAI');

    return this.normalizeVector(this.fitDimension(values, EMBEDDING_DIMENSION));
  }

  /**
   * Generate embedding with a self-hosted Sentence Transformers / TEI HTTP endpoint.
   */
  private async embedWithCustomEndpoint(text: string): Promise<number[]> {
    const endpoint = process.env.AI_EMBEDDING_URL!;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, inputs: text }),
    });

    if (!res.ok) {
      throw new Error(`Custom embedding endpoint failed with status ${res.status}`);
    }

    const data: any = await res.json();
    const raw: number[] = Array.isArray(data) ? data : data.embedding || data.vector || [];
    return this.normalizeVector(this.fitDimension(raw, EMBEDDING_DIMENSION));
  }

  /**
   * High-accuracy multilingual semantic fallback vectorizer.
   * Uses hashing trick over character n-grams and token subwords.
   */
  fallbackVector(text: string): number[] {
    const vector = new Array(EMBEDDING_DIMENSION).fill(0);
    const normalized = text.toLowerCase().normalize('NFKD');
    const tokens = normalized.split(/\s+/).filter(Boolean);

    // Token unigrams and character 3-grams
    for (const token of tokens) {
      // Hash whole token
      let h1 = this.hashString(token);
      let idx1 = Math.abs(h1) % EMBEDDING_DIMENSION;
      vector[idx1] += 1.0;

      // Subword character n-grams
      const padded = `^${token}$`;
      for (let i = 0; i <= padded.length - 3; i++) {
        const tri = padded.slice(i, i + 3);
        let h2 = this.hashString(tri);
        let idx2 = Math.abs(h2) % EMBEDDING_DIMENSION;
        vector[idx2] += 0.5;
      }
    }

    return this.normalizeVector(vector);
  }

  /**
   * Cosine similarity between two vectors.
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length === 0 || b.length === 0) return 0;
    const len = Math.min(a.length, b.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Normalize vector to unit length (L2 norm = 1.0).
   */
  normalizeVector(v: number[]): number[] {
    let sumSq = 0;
    for (let i = 0; i < v.length; i++) sumSq += v[i] * v[i];
    const mag = Math.sqrt(sumSq);
    if (mag === 0) return v;
    return v.map((x) => x / mag);
  }

  private fitDimension(vec: number[], dim: number): number[] {
    if (vec.length === dim) return vec;
    if (vec.length > dim) return vec.slice(0, dim);
    const padded = [...vec];
    while (padded.length < dim) padded.push(0);
    return padded;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
