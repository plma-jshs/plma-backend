import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/modules/users/users.module';
import { PointsModule } from '@/modules/points/points.module';
import { CasesModule } from '@/modules/cases/cases.module';
import { CaseSchedulesModule } from '@/modules/case-schedules/case-schedules.module';
import { SongsModule } from '@/modules/songs/songs.module';
import { DormRoomsModule } from '@/modules/dorms/dorms.module';
import { SessionModule } from '@/modules/session/session.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PointsModule,
    CasesModule,
    CaseSchedulesModule,
    SongsModule,
    DormRoomsModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
