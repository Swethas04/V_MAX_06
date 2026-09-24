import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // React dashboard
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Ensure uploads directory exists
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Swagger/OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Samadhan Setu API')
    .setDescription(
      'Societal Innovation Collaboration Portal — SIH PS 26043 | Govt of Jharkhand',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Phone/OTP authentication and JWT issuance')
    .addTag('Problems', 'Citizen problem submission and tracking')
    .addTag('Institutions', 'University/college management')
    .addTag('Teams', 'Project team and milestone management')
    .addTag('AI Routing', 'Problem classification and routing')
    .addTag('Notifications', 'In-app and push notifications')
    .addTag('Analytics', 'Admin dashboard data')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port') || 3000;

  await app.listen(port);
  logger.log(`🚀 Samadhan Setu API running at http://localhost:${port}/api/v1`);
  logger.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
