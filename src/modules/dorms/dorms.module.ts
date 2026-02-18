import { Module } from '@nestjs/common';
import { DormRoomsController } from './dorms.controller';
import { DormRoomsService } from './dorms.service';

@Module({
  controllers: [DormRoomsController],
  providers: [DormRoomsService],
})
export class DormRoomsModule {}