import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '@/prisma/prisma.module';
import { AccountsModule } from '@/modules/accounts/accounts.module';
import { PointsModule } from '@/modules/points/points.module';
import { CasesModule } from '@/modules/cases/cases.module';
import { CaseSchedulesModule } from '@/modules/case-schedules/case-schedules.module';
import { SongsModule } from '@/modules/songs/songs.module';
import { DormsModule } from '@/modules/dorms/dorms.module';
import { SessionModule } from '@/modules/session/session.module';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [
    PrismaModule,
    AccountsModule,
    PointsModule,
    CasesModule,
    CaseSchedulesModule,
    SongsModule,
    DormsModule,
    SessionModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
