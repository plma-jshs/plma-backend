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
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { AuthGuard } from "@/common/auth/auth.guard";
import { Permissions } from "@/common/auth/permissions.decorator";
import { CasesService } from "./cases.service";
import {
  CaseCreateScheduleResponseDto,
  CaseFindAllQueryDto,
  CaseFindAllResponseDto,
  CaseFindAllScheduleQueryDto,
  CaseFindAllScheduleResponseDto,
  CaseIdParamDto,
  CaseReplaceAllDto,
  CaseReplaceAllResponseDto,
  CaseScheduleCreateDto,
  CaseScheduleIdParamDto,
  CaseScheduleUpdateDto,
  CaseUpdateDto,
  CaseUpdateResponseDto,
  CaseUpdateScheduleResponseDto,
} from "./dto/cases.schema";

@ApiTags("Cases")
@Controller("cases")
@UseGuards(AuthGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @Permissions("viewRemoteCaseHistory", "viewAll")
  @ZodResponse({ type: CaseFindAllResponseDto })
  findAll(@Query() query: CaseFindAllQueryDto) {
    return this.casesService.findAll(query);
  }

  @Put()
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: CaseReplaceAllResponseDto })
  updateAll(@Body() body: CaseReplaceAllDto) {
    return this.casesService.updateAll(body);
  }

  @Get(":id")
  @Permissions("viewRemoteCaseHistory", "viewAll")
  findOne(@Param() params: CaseIdParamDto) {
    return this.casesService.findOne(params.id);
  }

  @Patch(":id")
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: CaseUpdateResponseDto })
  update(@Param() params: CaseIdParamDto, @Body() body: CaseUpdateDto) {
    return this.casesService.update(params.id, body);
  }

  @Post("schedules")
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: CaseCreateScheduleResponseDto })
  createSchedule(@Body() body: CaseScheduleCreateDto) {
    return this.casesService.createSchedule(body);
  }

  @Get("schedules")
  @Permissions("viewRemoteCaseHistory", "viewAll")
  @ZodResponse({ type: CaseFindAllScheduleResponseDto })
  findSchedules(@Query() query: CaseFindAllScheduleQueryDto) {
    return this.casesService.findSchedules(query);
  }

  @Patch("schedules/:id")
  @Permissions("applyAccess", "viewAll")
  @ZodResponse({ type: CaseUpdateScheduleResponseDto })
  updateSchedule(
    @Param() params: CaseScheduleIdParamDto,
    @Body() body: CaseScheduleUpdateDto,
  ) {
    return this.casesService.updateSchedule(params.id, body);
  }

  @Delete("schedules/:id")
  @Permissions("applyAccess", "viewAll")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSchedule(@Param() params: CaseScheduleIdParamDto) {
    return this.casesService.removeSchedule(params.id);
  }
}
