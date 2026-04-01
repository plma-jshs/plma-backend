import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

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
  providers: [AppService, PermissionsGuard, AuthGuard],
})
export class AppModule {}
