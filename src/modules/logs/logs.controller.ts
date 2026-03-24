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

  private async ensureAdminSession(
    authorization: string | undefined,
    cookie: string | undefined,
  ) {
    const session = await this.sessionService.checkSession({ authorization, cookie });

    if (!session || typeof session !== 'object') {
      throw new ForbiddenException('admin session is required');
    }

    const sessionData = session as Record<string, unknown>;
    if (sessionData.isLogined !== true || sessionData.jshsus !== true) {
      throw new ForbiddenException('admin session is required');
    }
  }

  @Get('points')
  async getPointLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    return this.logsService.getPointLogs();
  }

  @Get('songs')
  async getSongLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    return this.logsService.getSongLogs();
  }

  @Get('dorms')
  async getDormLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    return this.logsService.getDormLogs();
  }

  @Get('accounts')
  async getAccountLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    return this.logsService.getAccountLogs();
  }

  @Get('remote')
  async getRemoteLogs(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    return this.logsService.getRemoteLogs();
  }
}