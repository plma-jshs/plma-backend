import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CaseSchedulesService } from './case-schedules.service';
import {
  CaseScheduleCreateInput,
  CaseScheduleIdParams,
  CaseScheduleUpdateInput,
  caseScheduleCreateSchema,
  caseScheduleIdParamSchema,
  caseScheduleUpdateSchema,
} from './dto/case-schedules.schema';
import { parseZod } from '@/common/zod/parse-zod';

@ApiTags('Cases/Schedules')
@Controller('api/remote/cases/schedules')
export class CaseSchedulesController {
  constructor(private readonly caseSchedulesService: CaseSchedulesService) {}

  @Post()  create(@Body() body: unknown) {
    const payload = parseZod<CaseScheduleCreateInput>(caseScheduleCreateSchema, body);
    return this.caseSchedulesService.create(payload);
  }

  @Get()  findAll() {
    return this.caseSchedulesService.findAll();
  }

  @Patch(':id')  update(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<CaseScheduleIdParams>(caseScheduleIdParamSchema, params);
    const payload = parseZod<CaseScheduleUpdateInput>(caseScheduleUpdateSchema, body);
    return this.caseSchedulesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)  remove(@Param() params: unknown) {
    const { id } = parseZod<CaseScheduleIdParams>(caseScheduleIdParamSchema, params);
    return this.caseSchedulesService.remove(id);
  }
}