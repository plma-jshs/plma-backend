import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { UpdateCaseDto } from './dto/update-case.dto';

@ApiTags('Cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: '보관함 상태 목록 조회' })
  findAll() {
    return this.casesService.findAll();
  }

  @Put()
  @ApiOperation({ summary: '보관함 상태 일괄 변경 (DISCONNECTED 제외)' })
  replaceAll(@Body() body: UpdateCaseDto) {
    return this.casesService.replaceAll(body);
  }

  @Get(':caseId')
  @ApiOperation({ summary: '보관함 상태 단건 조회' })
  @ApiParam({ name: 'caseId', type: Number })
  findOne(@Param('caseId', ParseIntPipe) id: number) {
    return this.casesService.findOne(id);
  }

  @Patch(':caseId')
  @ApiOperation({ summary: '보관함 상태 수정' })
  @ApiParam({ name: 'caseId', type: Number })
  update(
    @Param('caseId', ParseIntPipe) id: number,
    @Body() updateCaseDto: UpdateCaseDto,
  ) {
    return this.casesService.update(id, updateCaseDto);
  }
}