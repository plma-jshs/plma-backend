import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<{
      method?: string;
      originalUrl?: string;
      url?: string;
      ip?: string;
      headers?: { "user-agent"?: string };
    }>();

    const response = context
      .switchToHttp()
      .getResponse<{ statusCode?: number }>();
    const startedAt = Date.now();
    const method = request.method ?? "UNKNOWN";
    const url = request.originalUrl ?? request.url ?? "unknown-url";
    const userAgent = request.headers?.["user-agent"] ?? "unknown-agent";
    const ip = request.ip ?? "unknown-ip";

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;
          const statusCode = response.statusCode ?? 200;
          this.logger.log(
            `${method} ${url} ${statusCode} ${durationMs}ms - ${ip} - ${userAgent}`,
          );
        },
        error: (error: unknown) => {
          const durationMs = Date.now() - startedAt;
          const statusCode =
            error instanceof HttpException ? error.getStatus() : 500;

          const message =
            error instanceof Error ? error.message : "unknown error";
          this.logger.error(
            `${method} ${url} ${statusCode} ${durationMs}ms - ${message} - ${ip}`,
          );
        },
      }),
    );
  }
}
