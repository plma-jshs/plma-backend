import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DormRoomsService } from './dorms.service';
import {
  DormAssignmentsQuery,
  DormAssignmentsUpsertInput,
  DormReportIdParams,
  DormReportCreateInput,
  DormReportUpdateInput,
  dormAssignmentsQuerySchema,
  dormAssignmentsUpsertSchema,
  dormReportCreateSchema,
  dormReportIdParamSchema,
  dormReportUpdateSchema,
} from './dto/dorms.schema';
import { parseZod } from '@/common/zod/parse-zod';

@ApiTags('dorms')
@Controller('api/dorms')
export class DormsController {
  constructor(private readonly dormRoomsService: DormRoomsService) {}

  @Get('assignments')  findAssignments(@Query() query: unknown) {
    const payload = parseZod<DormAssignmentsQuery>(dormAssignmentsQuerySchema, query);
    return this.dormRoomsService.findAssignments(payload);
  }

  @Put('assignments')  upsertAssignments(@Body() body: unknown) {
    const payload = parseZod<DormAssignmentsUpsertInput>(dormAssignmentsUpsertSchema, body);
    return this.dormRoomsService.upsertAssignments(payload);
  }

  @Post('reports')  createReport(@Body() body: unknown) {
    const payload = parseZod<DormReportCreateInput>(dormReportCreateSchema, body);
    return this.dormRoomsService.createReport(payload);
  }

  @Get('reports')  findReports() {
    return this.dormRoomsService.findReports();
  }

  @Patch('reports/:id')  updateReport(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<DormReportIdParams>(dormReportIdParamSchema, params);
    const payload = parseZod<DormReportUpdateInput>(dormReportUpdateSchema, body);
    return this.dormRoomsService.updateReport(id, payload);
  }

  @Delete('reports/:id')
  @HttpCode(HttpStatus.NO_CONTENT)  removeReport(@Param() params: unknown) {
    const { id } = parseZod<DormReportIdParams>(dormReportIdParamSchema, params);
    return this.dormRoomsService.removeReport(id);
  }
}