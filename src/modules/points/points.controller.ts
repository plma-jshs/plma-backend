import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { PointsService } from "./points.service";
import {
  PointCreateDto,
  PointCreateReasonResponseDto,
  PointCreateResponseDto,
  PointFindAllResponseDto,
  PointFindReasonsResponseDto,
  PointFindStudentByIdResponseDto,
  PointFindStudentsResponseDto,
  PointIdParamDto,
  PointListQueryDto,
  PointReasonCreateDto,
  PointReasonUpdateDto,
  PointStudentsQueryDto,
  PointUpdateReasonResponseDto,
  PointUpdateDto,
  PointUpdateResponseDto,
} from "./dto/points.schema";
import { AuthGuard } from "@/common/auth/auth.guard";
import { CurrentUser } from "@/common/auth/current-user.decorator";
import { Permissions } from "@/common/auth/permissions.decorator";
import { PermissionsGuard } from "@/common/auth/permissions.guard";

@ApiTags("Points")
@Controller("points")
@UseGuards(AuthGuard, PermissionsGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: PointCreateResponseDto })
  async create(
    @Body() body: PointCreateDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.pointsService.create(body, user.id);
  }

  @Get()
  @Permissions("viewPointsLogs", "viewAll")
  @ZodResponse({ type: PointFindAllResponseDto })
  findAll(@Query() query: PointListQueryDto) {
    return this.pointsService.findAll(query);
  }

  @Patch(":id")
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: PointUpdateResponseDto })
  update(
    @Param() params: PointIdParamDto,
    @Body() body: PointUpdateDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.pointsService.update(params.id, body, user.id);
  }

  @Delete(":id")
  @Permissions("applyAccess", "viewAll")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param() params: PointIdParamDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.pointsService.remove(params.id, user.id);
  }

  @Get("students")
  @Permissions("viewPointsLogs", "viewAll")
  @ZodResponse({ type: PointFindStudentsResponseDto })
  findStudents(@Query() query: PointStudentsQueryDto) {
    return this.pointsService.findStudents(query);
  }

  @Get("students/:id")
  @Permissions("viewPointsLogs", "viewAll")
  @ZodResponse({ type: PointFindStudentByIdResponseDto })
  findStudentById(@Param() params: PointIdParamDto) {
    return this.pointsService.findStudentById(params.id);
  }

  @Get("reasons")
  @Permissions("viewPointsLogs", "viewAll")
  @ZodResponse({ type: PointFindReasonsResponseDto })
  findReasons() {
    return this.pointsService.findReasons();
  }

  @Post("reasons")
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: PointCreateReasonResponseDto })
  createReason(@Body() body: PointReasonCreateDto) {
    return this.pointsService.createReason(body);
  }

  @Patch("reasons/:id")
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: PointUpdateReasonResponseDto })
  updateReason(
    @Param() params: PointIdParamDto,
    @Body() body: PointReasonUpdateDto,
  ) {
    return this.pointsService.updateReason(params.id, body);
  }

  @Delete("reasons/:id")
  @Permissions("applyAccess", "viewAll")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeReason(@Param() params: PointIdParamDto) {
    return this.pointsService.removeReason(params.id);
  }
}
