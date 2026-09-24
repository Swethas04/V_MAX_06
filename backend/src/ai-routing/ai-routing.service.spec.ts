import { describe, it, expect, beforeAll } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { EmbeddingService } from './embedding.service';
import { AiRoutingService } from './ai-routing.service';
import { ProblemCategory } from '../problems/problem.entity';

describe('AI Routing & Semantic Embedding Pipeline', () => {
  let embeddingService: EmbeddingService;
  let aiRoutingService: AiRoutingService;

  beforeAll(async () => {
    const configService = new ConfigService({
      ai: { embeddingMode: 'transformers' },
    });
    embeddingService = new EmbeddingService(configService);
    await embeddingService.onModuleInit();

    const mockProblemRepo: any = { findOne: async () => null };
    const mockInstitutionRepo: any = { createQueryBuilder: () => ({ getMany: async () => [] }) };
    const mockDataSource: any = { query: async () => [] };

    aiRoutingService = new AiRoutingService(
      mockProblemRepo,
      mockInstitutionRepo,
      mockDataSource,
      embeddingService,
    );
    await aiRoutingService.initThemeCentroids();
  }, 45000);

  it('should generate a 384-dimensional normalized dense embedding vector', async () => {
    const vector = await embeddingService.embedText('Contaminated groundwater in Bokaro');
    expect(vector).toBeDefined();
    expect(vector.length).toBe(384);

    // Magnitude of normalized unit vector should be ~1.0
    const mag = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    expect(mag).toBeCloseTo(1.0, 2);
  });

  it('should compute high cosine similarity for semantically close texts', async () => {
    const v1 = await embeddingService.embedText('Broken drinking water pipeline');
    const v2 = await embeddingService.embedText('Damaged water pipe and acute drinking water shortage');
    const v3 = await embeddingService.embedText('Heavy truck traffic and road accident');

    const sim12 = embeddingService.cosineSimilarity(v1, v2);
    const sim13 = embeddingService.cosineSimilarity(v1, v3);

    expect(sim12).toBeGreaterThan(sim13);
    expect(sim12).toBeGreaterThan(0.70);
  });

  it('should classify English problem text to correct theme centroid', async () => {
    const result = await aiRoutingService.classifyCategory(
      'Severe arsenic and fluoride in community drinking water well',
    );
    expect(result.category).toBe(ProblemCategory.WATER);
    expect(result.confidence).toBeGreaterThan(0.50);
  });

  it('should classify Hindi problem text to correct theme centroid', async () => {
    const result = await aiRoutingService.classifyCategory(
      'धान की फसल में कीट प्रकोप और यूरिया खाद की भारी किल्लत',
    );
    expect(result.category).toBe(ProblemCategory.AGRICULTURE);
    expect(result.confidence).toBeGreaterThan(0.50);
  });

  it('should compute weighted priority score factoring in urgency keywords', () => {
    const scoreNormal = aiRoutingService.computePriority({
      upvotes: 2,
      createdAt: new Date(),
      title: 'Road needs repair',
      description: 'Minor potholes near village gate',
    } as any);

    const scoreUrgent = aiRoutingService.computePriority({
      upvotes: 15,
      createdAt: new Date(),
      title: 'Critical Emergency: Bridge collapse fatal danger',
      description: 'Immediate crisis, road caved in and fatal accident risk',
    } as any);

    expect(scoreUrgent).toBeGreaterThan(scoreNormal);
    expect(scoreUrgent).toBeGreaterThan(60);
  });

  it('should compute matchedOn tags by intersecting researchAreas + domainTags + incubationCells', () => {
    const institution = {
      researchAreas: ['Water Resource Research', 'civil engineering'],
      domainTags: ['environmental', 'IoT'],
      incubationCells: ['AgriTech Incubation Cell', 'Technology Business Incubator (TBI)'],
    };

    const waterCategoryTags = ['water', 'Water Resource Research', 'civil engineering', 'environmental'];
    const matchedWater = aiRoutingService.intersectTags(institution, waterCategoryTags);
    expect(matchedWater).toContain('Water Resource Research');
    expect(matchedWater).toContain('civil engineering');
    expect(matchedWater).toContain('environmental');
    expect(matchedWater).not.toContain('IoT');

    const agriCategoryTags = ['agriculture', 'agritech', 'AgriTech Incubation Cell', 'food tech'];
    const matchedAgri = aiRoutingService.intersectTags(institution, agriCategoryTags);
    expect(matchedAgri).toContain('AgriTech Incubation Cell');
    expect(matchedAgri).not.toContain('IoT');
  });

  it('should return { institutionId, institutionName, matchedOn } from suggestInstitutions', async () => {
    let capturedWhere = '';
    const mockQueryBuilder: any = {
      where: (clause: string) => {
        capturedWhere = clause;
        return mockQueryBuilder;
      },
      orderBy: () => mockQueryBuilder,
      take: () => mockQueryBuilder,
      getMany: async () => [
        {
          id: 'inst-1',
          name: 'IIT (ISM) Dhanbad',
          researchAreas: ['water', 'Water Resource Research'],
          domainTags: ['civil engineering'],
          incubationCells: ['Technology Business Incubator (TBI)'],
        },
      ],
    };

    const customRepo: any = {
      createQueryBuilder: () => mockQueryBuilder,
      find: async () => [],
    };

    const customService = new AiRoutingService(
      {} as any,
      customRepo,
      {} as any,
      embeddingService,
    );

    const suggestions = await customService.suggestInstitutions(ProblemCategory.WATER);

    expect(capturedWhere).toContain('i.incubationCells && :tags');
    expect(capturedWhere).toContain('i.researchAreas && :tags');
    expect(capturedWhere).toContain('i.domainTags && :tags');

    expect(suggestions.length).toBe(1);
    expect(suggestions[0]).toEqual({
      institutionId: 'inst-1',
      institutionName: 'IIT (ISM) Dhanbad',
      matchedOn: expect.arrayContaining(['water', 'Water Resource Research', 'civil engineering']),
    });
  });
});
