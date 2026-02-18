import { Module } from '@nestjs/common';
import { DormsController } from './dorms.controller';
import { DormRoomsService } from './dorms.service';

@Module({
  controllers: [DormsController],
  providers: [DormRoomsService],
})
export class DormsModule {}