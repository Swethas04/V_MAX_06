import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  uploadDest: process.env.UPLOAD_DEST || './uploads',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
}));

export const dbConfig = registerAs('db', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'samadhan',
  password: process.env.DB_PASSWORD || 'samadhan_secret',
  database: process.env.DB_NAME || 'samadhan_setu',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'dev_secret_change_in_prod',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
}));

export const otpConfig = registerAs('otp', () => ({
  mockMode: process.env.MOCK_OTP === 'true',
  msg91AuthKey: process.env.MSG91_AUTH_KEY,
  msg91SenderId: process.env.MSG91_SENDER_ID || 'SMDHAN',
}));

export const aiConfig = registerAs('ai', () => ({
  embeddingMode: process.env.AI_EMBEDDING_MODE || 'random',
  openaiApiKey: process.env.OPENAI_API_KEY,
}));
