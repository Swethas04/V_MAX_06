"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiConfig = exports.otpConfig = exports.redisConfig = exports.jwtConfig = exports.dbConfig = exports.appConfig = void 0;
const config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    uploadDest: process.env.UPLOAD_DEST || './uploads',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
}));
exports.dbConfig = (0, config_1.registerAs)('db', () => ({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'samadhan',
    password: process.env.DB_PASSWORD || 'samadhan_secret',
    database: process.env.DB_NAME || 'samadhan_setu',
}));
exports.jwtConfig = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET || 'dev_secret_change_in_prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
exports.redisConfig = (0, config_1.registerAs)('redis', () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
}));
exports.otpConfig = (0, config_1.registerAs)('otp', () => ({
    mockMode: process.env.MOCK_OTP === 'true',
    msg91AuthKey: process.env.MSG91_AUTH_KEY,
    msg91SenderId: process.env.MSG91_SENDER_ID || 'SMDHAN',
}));
exports.aiConfig = (0, config_1.registerAs)('ai', () => ({
    embeddingMode: process.env.AI_EMBEDDING_MODE || 'random',
    openaiApiKey: process.env.OPENAI_API_KEY,
}));
//# sourceMappingURL=configuration.js.map