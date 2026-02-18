import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionService } from './session.service';

@ApiTags('Session')
@Controller('api/user')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: '현재 세션 사용자 조회' })
  @ApiOkResponse({
    description: '현재 세션 사용자(없으면 null)',
    schema: {
      example: {
        id: 12,
        stuid: 31101,
        name: '홍길동',
        phoneNumber: '010-1234-5678',
        studentId: 1,
        student: { id: 1, stuid: 31101, name: '홍길동', grade: 3, class: 1, num: 1, point: 0 },
      },
    },
  })
  getCurrentUser() {
    return this.sessionService.getCurrentUser();
  }
}