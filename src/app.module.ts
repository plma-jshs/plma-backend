import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '@/prisma/prisma.module';
import { StudentsModule } from '@/modules/students/students.module';
import { UsersModule } from '@/modules/users/users.module';
import { ReasonsModule } from '@/modules/reasons/reasons.module';
import { PointsModule } from '@/modules/points/points.module';
import { CasesModule } from '@/modules/cases/cases.module';
import { CaseSchedulesModule } from '@/modules/case-schedules/case-schedules.module';
import { SongsModule } from '@/modules/songs/songs.module';
import { DormRoomsModule } from '@/modules/dorm-rooms/dorm-rooms.module';
import { DormUsersModule } from '@/modules/dorm-users/dorm-users.module';
import { DormReportsModule } from '@/modules/dorm-reports/dorm-reports.module';
import { LogsModule } from '@/modules/logs/logs.module';
import { SessionModule } from '@/modules/session/session.module';

@Module({
  imports: [
    PrismaModule,
    StudentsModule,
    UsersModule,
    ReasonsModule,
    PointsModule,
    CasesModule,
    CaseSchedulesModule,
    SongsModule,
    DormRoomsModule,
    DormUsersModule,
    DormReportsModule,
    LogsModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
