import { ProblemCategory, SubmitterType } from '../problem.entity';
export declare class CreateProblemDto {
    title: string;
    description: string;
    category?: ProblemCategory;
    submitterType?: SubmitterType;
    organizationName?: string;
    registrationId?: string;
    submitterName?: string;
    submitterPhone?: string;
    latitude?: number;
    longitude?: number;
    district?: string;
    village?: string;
}
export declare class ProblemsQueryDto {
    page?: number;
    limit?: number;
    category?: ProblemCategory;
    submitterType?: SubmitterType;
    lat?: number;
    lng?: number;
    radius?: number;
    district?: string;
    q?: string;
}
export { CheckSimilarDto, SupportProblemDto } from './check-similar.dto';
