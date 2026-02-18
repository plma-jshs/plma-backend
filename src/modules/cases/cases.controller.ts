import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import {
  CaseIdParams,
  CaseScheduleCreateInput,
  CaseScheduleIdParams,
  CaseScheduleUpdateInput,
  CaseUpdateInput,
  caseIdParamSchema,
  caseScheduleCreateSchema,
  caseScheduleIdParamSchema,
  caseScheduleUpdateSchema,
  updateCaseSchema,
} from './dto/cases.schema';
import { parseZod } from '@/common/zod/parse-zod';

@ApiTags('Cases')
@Controller('api/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  findAll() {
    return this.casesService.findAll();
  }

  @Put()
  updateAll(@Body() body: unknown) {
    const payload = parseZod<CaseUpdateInput>(updateCaseSchema, body);
    return this.casesService.updateAll(payload);
  }

  @Get(':id')
  findOne(@Param() params: unknown) {
    const { id } = parseZod<CaseIdParams>(caseIdParamSchema, params);
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<CaseIdParams>(caseIdParamSchema, params);
    const payload = parseZod<CaseUpdateInput>(updateCaseSchema, body);
    return this.casesService.update(id, payload);
  }

  @Post()
  create(@Body() body: unknown) {
    const payload = parseZod<CaseScheduleCreateInput>(caseScheduleCreateSchema, body);
    return this.casesService.createSchedule(payload);
  }

  @Get()
  findAllSchedule() {
    return this.casesService.findAllSchedule();
  }

  @Patch(':id')
  updateSchedule(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<CaseScheduleIdParams>(caseScheduleIdParamSchema, params);
    const payload = parseZod<CaseScheduleUpdateInput>(caseScheduleUpdateSchema, body);
    return this.casesService.updateSchedule(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: unknown) {
    const { id } = parseZod<CaseScheduleIdParams>(caseScheduleIdParamSchema, params);
    return this.casesService.removeSchedule(id);
  }
}