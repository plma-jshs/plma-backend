import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('PLMA API')
      .setDescription('PLMA API documentation')
      .setVersion('0.0')
      .build(),
  );

  SwaggerModule.setup('api', app, openApiDoc);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
