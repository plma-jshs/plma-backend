import { Module } from '@nestjs/common';
import { DormRoomsController } from './dorm-rooms.controller';
import { DormRoomsService } from './dorm-rooms.service';

@Module({
  controllers: [DormRoomsController],
  providers: [DormRoomsService],
})
export class DormRoomsModule {}