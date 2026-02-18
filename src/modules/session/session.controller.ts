import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionService } from './session.service';

@ApiTags('Session')
@Controller('api/user')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: '현재 세션 사용자 조회' })
  getCurrentUser() {
    return this.sessionService.getCurrentUser();
  }
}