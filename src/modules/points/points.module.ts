import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { SessionModule } from '@/modules/session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}