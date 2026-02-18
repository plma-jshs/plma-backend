import { Module } from '@nestjs/common';
import { DormUsersController } from './dorm-users.controller';
import { DormUsersService } from './dorm-users.service';

@Module({
  controllers: [DormUsersController],
  providers: [DormUsersService],
})
export class DormUsersModule {}