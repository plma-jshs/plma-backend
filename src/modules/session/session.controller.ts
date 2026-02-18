import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionService } from './session.service';

@ApiTags('Session')
@Controller('api/user')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()  getCurrentUser() {
    return this.sessionService.getCurrentUser();
  }
}