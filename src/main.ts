import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import {
  cleanupOpenApiDoc,
  ZodSerializerInterceptor,
  ZodValidationPipe,
} from "nestjs-zod";
import { GlobalExceptionFilter } from "@/common/filters/global-exception.filter";
import { LoggingInterceptor } from "@/common/interceptors/logging.interceptor";

async function bootstrap() {
  const corsOriginsRaw = process.env.CORS_ORIGINS;
  if (!corsOriginsRaw) {
    throw new Error("CORS_ORIGINS is not defined");
  }

  const portRaw = process.env.PORT;
  if (!portRaw) {
    throw new Error("PORT is not defined");
  }

  const port = Number(portRaw);
  if (!Number.isInteger(port) || port < 1) {
    throw new Error("PORT must be a positive integer");
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ZodSerializerInterceptor(),
  );

  const corsOrigins = corsOriginsRaw
    .split(",")
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

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("PLMA API")
      .setDescription("PLMA API documentation")
      .setVersion("0.0")
      .build(),
  );

  SwaggerModule.setup("api/docs", app, cleanupOpenApiDoc(openApiDoc));

  await app.listen(port);
}
bootstrap();
