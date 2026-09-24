import { User } from '../users/user.entity';
import { Institution } from '../institutions/institution.entity';
export declare enum ProblemStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    ASSIGNED = "assigned",
    TEAM_FORMED = "team_formed",
    PROTOTYPE = "prototype",
    PILOTED = "piloted",
    RESOLVED = "resolved",
    REJECTED = "rejected"
}
export declare enum ProblemCategory {
    WATER = "water",
    ROADS = "roads",
    AGRICULTURE = "agriculture",
    HEALTHCARE = "healthcare",
    EDUCATION = "education",
    ENVIRONMENT = "environment",
    URBAN_INFRA = "urban_infra",
    ACCESSIBILITY = "accessibility",
    LIVELIHOOD = "livelihood",
    OTHER = "other"
}
export declare enum SubmitterType {
    INDIVIDUAL = "individual",
    COMMUNITY_ORG = "community_org",
    PRI = "pri",
    ULB = "ulb",
    GOVT_DEPARTMENT = "govt_department"
}
export declare class Problem {
    id: string;
    title: string;
    description: string;
    category: ProblemCategory;
    categoryManual: ProblemCategory | null;
    location: string | null;
    district: string | null;
    village: string | null;
    media: {
        type: 'photo' | 'voice' | 'doc';
        url: string;
        message?: string;
        addedBy?: string;
        addedAt?: string;
    }[];
    status: ProblemStatus;
    priorityScore: number;
    upvotes: number;
    embedding: number[] | null;
    duplicateOfId: string | null;
    duplicateOf: Problem | null;
    submitterType: SubmitterType;
    organizationName: string | null;
    registrationId: string | null;
    submitterName: string | null;
    submitterPhone: string | null;
    submittedById: string | null;
    submittedBy: User | null;
    assignedInstitutionId: string | null;
    assignedInstitution: Institution | null;
    aiRoutingResult: {
        category: string;
        priorityScore: number;
        duplicateCandidateIds: string[];
        suggestedInstitutionIds: string[];
        suggestedInstitutionsExplained?: {
            institutionId: string;
            institutionName: string;
            matchedOn: string[];
        }[];
    } | null;
    upvoterIds: string[];
    createdAt: Date;
    updatedAt: Date;
}
