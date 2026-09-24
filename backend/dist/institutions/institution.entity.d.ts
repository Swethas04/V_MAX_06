export declare class Institution {
    id: string;
    name: string;
    shortName: string | null;
    city: string | null;
    district: string | null;
    departments: string[];
    researchAreas: string[];
    incubationCells: string[];
    domainTags: string[];
    problemsResolved: number;
    problemsActive: number;
    createdAt: Date;
    updatedAt: Date;
}
