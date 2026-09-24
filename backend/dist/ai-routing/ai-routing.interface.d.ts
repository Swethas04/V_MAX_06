import { ProblemCategory, ProblemStatus } from '../problems/problem.entity';
export interface CategoryClassificationResult {
    category: ProblemCategory;
    confidence: number;
    scores: Record<string, number>;
}
export interface DuplicateCandidateResult {
    id: string;
    title: string;
    description: string;
    category: ProblemCategory;
    status: ProblemStatus;
    similarity: number;
    distanceKm?: number | null;
    upvotes: number;
    district?: string | null;
    village?: string | null;
    media?: any[];
    createdAt?: string;
}
export interface SuggestedInstitutionMatch {
    institutionId: string;
    institutionName: string;
    matchedOn: string[];
}
export interface AIRoutingResult {
    category: ProblemCategory;
    confidence?: number;
    priorityScore: number;
    duplicateCandidateIds: string[];
    suggestedInstitutionIds: string[];
    suggestedInstitutionsExplained?: SuggestedInstitutionMatch[];
}
