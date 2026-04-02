import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";
import { PasswordService } from "@/common/security/password.service";
import { PermissionsGuard } from "@/common/auth/permissions.guard";

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PasswordService, PermissionsGuard],
})
export class AccountsModule {}
