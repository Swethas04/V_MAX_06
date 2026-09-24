import { Repository } from 'typeorm';
import { Institution } from './institution.entity';
export declare class InstitutionsService {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<Institution>);
    findAll(): Promise<Institution[]>;
    findOne(id: string): Promise<Institution | null>;
    getLeaderboard(): Promise<Institution[]>;
    matchByDomainTags(tags: string[]): Promise<Institution[]>;
}
