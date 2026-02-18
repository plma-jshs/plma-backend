import { Module } from '@nestjs/common';
import { CaseSchedulesController } from './case-schedules.controller';
import { CaseSchedulesService } from './case-schedules.service';

@Module({
  controllers: [CaseSchedulesController],
  providers: [CaseSchedulesService],
})
export class CaseSchedulesModule {}