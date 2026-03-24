import { Controller, ForbiddenException, Get, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { SessionService } from '@/modules/session/session.service';

@ApiTags('Logs')
@Controller('api/logs')
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
    private readonly sessionService: SessionService,
  ) {}

  private async ensurePermission(
    authorization: string | undefined,
    cookie: string | undefined,
    requiredPermissions: string[],
  ) {
    const session = await this.sessionService.checkSession({ authorization, cookie });

    const sessionData = session as { isLogined?: unknown; permissions?: unknown };
    const permissions = Array.isArray(sessionData.permissions)
      ? sessionData.permissions.filter((permission): permission is string => typeof permission === 'string')
      : [];

    if (sessionData.isLogined !== true) {
      throw new ForbiddenException('login session is required');
    }

    const hasPermission = requiredPermissions.some((permission) => permissions.includes(permission));
    if (!hasPermission) {
      throw new ForbiddenException('permission is required');
    }
  }

  @Get('points')
  async getPointLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensurePermission(authorization, cookie, ['viewPointsLogs', 'viewAll']);
    return this.logsService.getPointLogs();
  }

  @Get('songs')
  async getSongLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensurePermission(authorization, cookie, ['viewRemoteSongsView', 'viewAll']);
    return this.logsService.getSongLogs();
  }

  @Get('dorms')
  async getDormLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensurePermission(authorization, cookie, ['viewDormStatus', 'viewDormManage', 'viewAll']);
    return this.logsService.getDormLogs();
  }

  @Get('accounts')
  async getAccountLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensurePermission(authorization, cookie, ['viewIAMAccounts', 'viewPLMAAccounts', 'viewAll']);
    return this.logsService.getAccountLogs();
  }

  @Get('remote')
  async getRemoteLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensurePermission(authorization, cookie, ['viewRemoteCaseHistory', 'viewAll']);
    return this.logsService.getRemoteLogs();
  }
}