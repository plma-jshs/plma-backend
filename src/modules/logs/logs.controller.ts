import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LogsService } from "./logs.service";
import { Permissions } from "@/common/auth/permissions.decorator";
import { PermissionsGuard } from "@/common/auth/permissions.guard";

@ApiTags("Logs")
@Controller("logs")
@UseGuards(PermissionsGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get("points")
  @Permissions("viewPointsLogs", "viewAll")
  async getPointLogs() {
    return this.logsService.getPointLogs();
  }

  @Get("songs")
  @Permissions("viewRemoteSongsView", "viewAll")
  async getSongLogs() {
    return this.logsService.getSongLogs();
  }

  @Get("dorms")
  @Permissions("viewDormStatus", "viewDormManage", "viewAll")
  async getDormLogs() {
    return this.logsService.getDormLogs();
  }

  @Get("accounts")
  @Permissions("viewIAMAccounts", "viewPLMAAccounts", "viewAll")
  async getAccountLogs() {
    return this.logsService.getAccountLogs();
  }

  @Get("remote")
  @Permissions("viewRemoteCaseHistory", "viewAll")
  async getRemoteLogs() {
    return this.logsService.getRemoteLogs();
  }
}
