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
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { DormRoomsService } from "./dorms.service";
import {
  DormAssignmentsQueryDto,
  DormCreateReportResponseDto,
  DormFindAssignmentsResponseDto,
  DormFindReportsResponseDto,
  DormReportsQueryDto,
  DormAssignmentsUpsertDto,
  DormUpsertAssignmentsResponseDto,
  DormReportCreateDto,
  DormReportIdParamDto,
  DormReportUpdateDto,
  DormUpdateReportResponseDto,
} from "./dto/dorms.schema";

@ApiTags("dorms")
@Controller("dorms")
export class DormsController {
  constructor(private readonly dormRoomsService: DormRoomsService) {}

  @Get("assignments")
  @ZodResponse({ type: DormFindAssignmentsResponseDto })
  findAssignments(@Query() query: DormAssignmentsQueryDto) {
    return this.dormRoomsService.findAssignments(query);
  }

  @Put("assignments")
  @ZodResponse({ type: DormUpsertAssignmentsResponseDto })
  upsertAssignments(@Body() body: DormAssignmentsUpsertDto) {
    return this.dormRoomsService.upsertAssignments(body);
  }

  @Post("reports")
  @ZodResponse({ type: DormCreateReportResponseDto })
  createReport(@Body() body: DormReportCreateDto) {
    return this.dormRoomsService.createReport(body);
  }

  @Get("reports")
  @ZodResponse({ type: DormFindReportsResponseDto })
  findReports(@Query() query: DormReportsQueryDto) {
    return this.dormRoomsService.findReports(query);
  }

  @Patch("reports/:id")
  @ZodResponse({ type: DormUpdateReportResponseDto })
  updateReport(
    @Param() params: DormReportIdParamDto,
    @Body() body: DormReportUpdateDto,
  ) {
    return this.dormRoomsService.updateReport(params.id, body);
  }

  @Delete("reports/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeReport(@Param() params: DormReportIdParamDto) {
    return this.dormRoomsService.removeReport(params.id);
  }
}
