import { Institution } from '../institutions/institution.entity';
export declare enum UserRole {
    CITIZEN = "citizen",
    STUDENT = "student",
    FACULTY = "faculty",
    INDUSTRY_PARTNER = "industry_partner",
    ADMIN = "admin"
}
export declare enum Language {
    EN = "en",
    HI = "hi"
}
export declare enum SubmitterType {
    INDIVIDUAL = "individual",
    COMMUNITY_ORG = "community_org",
    PRI = "pri",
    ULB = "ulb",
    GOVT_DEPARTMENT = "govt_department"
}
export declare class User {
    id: string;
    name: string;
    phone: string;
    role: UserRole;
    submitterType: SubmitterType;
    organizationName: string | null;
    registrationId: string | null;
    languagePref: Language;
    orgAffiliation: string | null;
    institutionId: string | null;
    institution: Institution | null;
    fcmToken: string | null;
    otpCode: string | null;
    otpExpiresAt: Date | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
