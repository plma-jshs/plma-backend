import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());

  const openApiDoc = SwaggerModule.createDocument(app, 
    new DocumentBuilder()
      .setTitle('PLMA API')
      .setDescription('PLMA API documentation')
      .setVersion('0.0')
      .build()
  );

  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
