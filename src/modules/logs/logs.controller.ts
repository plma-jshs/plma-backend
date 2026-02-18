import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';

@ApiTags('Logs')
@Controller('api/logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('points')  getPointLogs() {
    return this.logsService.getPointLogs();
  }

  @Get('songs')  getSongLogs() {
    return this.logsService.getSongLogs();
  }

  @Get('dorms')  getDormLogs() {
    return this.logsService.getDormLogs();
  }

  @Get('accounts')  getAccountLogs() {
    return this.logsService.getAccountLogs();
  }

  @Get('remote')  getRemoteLogs() {
    return this.logsService.getRemoteLogs();
  }
}