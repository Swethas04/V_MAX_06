import { DataSource } from 'typeorm';
import { InstitutionsService } from '../institutions/institutions.service';
export declare class AnalyticsController {
    private readonly dataSource;
    private readonly institutionsService;
    constructor(dataSource: DataSource, institutionsService: InstitutionsService);
    districtHeatmap(): Promise<any>;
    categoryDistribution(): Promise<any>;
    submitterDistribution(): Promise<any>;
    statusFunnel(): Promise<{
        status: string;
        count: number;
    }[]>;
    leaderboard(): Promise<import("../institutions/institution.entity").Institution[]>;
    summary(): Promise<{
        totalProblems: number;
        totalTeams: number;
        totalCitizens: number;
        resolvedProblems: number;
        resolutionRate: string;
    }>;
    recentActivity(limit?: number): Promise<any>;
}
