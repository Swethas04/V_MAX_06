import { InstitutionsService } from './institutions.service';
export declare class InstitutionsController {
    private readonly service;
    constructor(service: InstitutionsService);
    findAll(): Promise<import("./institution.entity").Institution[]>;
    leaderboard(): Promise<import("./institution.entity").Institution[]>;
    findOne(id: string): Promise<import("./institution.entity").Institution | null>;
}
