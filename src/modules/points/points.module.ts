import { Module } from "@nestjs/common";
import { PointsController } from "./points.controller";
import { PointsService } from "./points.service";
import { AuthGuard } from "@/common/auth/auth.guard";

@Module({
  controllers: [PointsController],
  providers: [PointsService, AuthGuard],
})
export class PointsModule {}
