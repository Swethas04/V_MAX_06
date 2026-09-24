import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from './institution.entity';

@Injectable()
export class InstitutionsService {
  private readonly logger = new Logger(InstitutionsService.name);

  constructor(
    @InjectRepository(Institution) private readonly repo: Repository<Institution>,
  ) {}

  findAll(): Promise<Institution[]> {
    return this.repo.find({ order: { problemsResolved: 'DESC' } });
  }

  findOne(id: string): Promise<Institution | null> {
    return this.repo.findOne({ where: { id } });
  }

  async getLeaderboard(): Promise<Institution[]> {
    return this.repo.find({
      select: { id: true, name: true, shortName: true, city: true, problemsResolved: true, problemsActive: true },
      order: { problemsResolved: 'DESC' },
      take: 20,
    });
  }

  async matchByDomainTags(tags: string[]): Promise<Institution[]> {
    if (!tags.length) return this.findAll();
    // Postgres array overlap query
    return this.repo
      .createQueryBuilder('i')
      .where('i.research_areas && :tags', { tags })
      .orWhere('i.domain_tags && :tags', { tags })
      .orderBy('i.problems_resolved', 'DESC')
      .take(5)
      .getMany();
  }
}
