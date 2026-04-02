import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { LoggingInterceptor } from "@/common/interceptors/logging.interceptor";
import { GlobalExceptionFilter } from "@/common/filters/global-exception.filter";

import { DbModule } from "@/db/db.module";
import { AccountsModule } from "@/modules/accounts/accounts.module";
import { PointsModule } from "@/modules/points/points.module";
import { CasesModule } from "@/modules/cases/cases.module";
import { SongsModule } from "@/modules/songs/songs.module";
import { DormsModule } from "@/modules/dorms/dorms.module";
import { SessionModule } from "@/modules/session/session.module";
import { LogsModule } from "@/modules/logs/logs.module";
import { PermissionsGuard } from "@/common/auth/permissions.guard";
import { AuthGuard } from "@/common/auth/auth.guard";

@Module({
  imports: [
    DbModule,
    AccountsModule,
    PointsModule,
    CasesModule,
    SongsModule,
    DormsModule,
    SessionModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // 이참에 같이 등록
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor, // 에러의 주범 해결!
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
