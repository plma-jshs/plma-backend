import { Module } from "@nestjs/common";
import { LogsController } from "./logs.controller";
import { LogsService } from "./logs.service";
import { PermissionsGuard } from "@/common/auth/permissions.guard";

@Module({
  controllers: [LogsController],
  providers: [LogsService, PermissionsGuard],
})
export class LogsModule {}
