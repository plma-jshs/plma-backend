import 'dotenv/config';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from '@/prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter());

  const corsOrigins = (process.env.CORS_ORIGINS
    ?? 'https://plma.jshsus.kr,https://iam.jshsus.kr,http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  });

  const generatedSwaggerPath = resolve(process.cwd(), 'docs', 'swagger.json');
  const hasGeneratedSwagger = existsSync(generatedSwaggerPath);

  const openApiDoc = hasGeneratedSwagger
    ? JSON.parse(readFileSync(generatedSwaggerPath, 'utf8'))
    : SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('PLMA API')
          .setDescription('PLMA API documentation')
          .setVersion('0.0')
          .build(),
      );

  SwaggerModule.setup('api/docs', app, openApiDoc);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
