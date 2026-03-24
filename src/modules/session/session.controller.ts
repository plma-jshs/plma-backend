import { Controller, Get, Headers } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { apiUserSwaggerSchema, checkSessionSwaggerSchema } from './dto/session.schema';

@ApiTags('Session')
@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('api/user')
  @ApiOperation({ summary: '현재 로그인 세션 기준 사용자 조회' })
  @ApiOkResponse({ schema: apiUserSwaggerSchema })
  @ApiUnauthorizedResponse({ description: 'Authorization 헤더 또는 iam_token 쿠키가 없거나 유효하지 않음' })
  getCurrentUser(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    return this.sessionService.getCurrentUser({ authorization, cookie });
  }

  @Get('check-session')
  @ApiOperation({ summary: 'IAM 세션 검증' })
  @ApiOkResponse({ schema: checkSessionSwaggerSchema })
  @ApiUnauthorizedResponse({ description: 'Authorization 헤더 또는 iam_token 쿠키가 없거나 유효하지 않음' })
  checkSession(
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    return this.sessionService.checkSession({ authorization, cookie });
  }
}