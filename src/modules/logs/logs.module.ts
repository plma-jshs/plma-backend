import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { SessionModule } from '@/modules/session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}