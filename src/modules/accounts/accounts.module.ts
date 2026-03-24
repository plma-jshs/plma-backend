import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { SessionModule } from '@/modules/session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}