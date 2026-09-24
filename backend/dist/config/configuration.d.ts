export declare const appConfig: (() => {
    nodeEnv: string;
    port: number;
    uploadDest: string;
    maxFileSizeMb: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    uploadDest: string;
    maxFileSizeMb: number;
}>;
export declare const dbConfig: (() => {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}>;
export declare const jwtConfig: (() => {
    secret: string;
    expiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    expiresIn: string;
}>;
export declare const redisConfig: (() => {
    host: string;
    port: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
}>;
export declare const otpConfig: (() => {
    mockMode: boolean;
    msg91AuthKey: string | undefined;
    msg91SenderId: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    mockMode: boolean;
    msg91AuthKey: string | undefined;
    msg91SenderId: string;
}>;
export declare const aiConfig: (() => {
    embeddingMode: string;
    openaiApiKey: string | undefined;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    embeddingMode: string;
    openaiApiKey: string | undefined;
}>;
