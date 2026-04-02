import { Module } from "@nestjs/common";
import { CasesController } from "./cases.controller";
import { CasesService } from "./cases.service";
import { AuthGuard } from "@/common/auth/auth.guard";

@Module({
  controllers: [CasesController],
  providers: [CasesService, AuthGuard],
})
export class CasesModule {}
