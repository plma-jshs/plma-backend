import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import {
  CaseIdParams,
  CaseUpdateInput,
  caseIdParamSchema,
  updateCaseSchema,
} from './dto/cases.schema';
import { parseZod } from '@/common/zod/parse-zod';

@ApiTags('Cases')
@Controller('api/remote/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()  findAll() {
    return this.casesService.findAll();
  }

  @Put()  replaceAll(@Body() body: unknown) {
    const payload = parseZod<CaseUpdateInput>(updateCaseSchema, body);
    return this.casesService.replaceAll(payload);
  }

  @Get(':id')  findOne(@Param() params: unknown) {
    const { id } = parseZod<CaseIdParams>(caseIdParamSchema, params);
    return this.casesService.findOne(id);
  }

  @Patch(':id')  update(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<CaseIdParams>(caseIdParamSchema, params);
    const payload = parseZod<CaseUpdateInput>(updateCaseSchema, body);
    return this.casesService.update(id, payload);
  }
}