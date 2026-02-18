import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { UpdateCaseDto } from './dto/update-case.dto';

@ApiTags('Cases')
@Controller('api/remote/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: '보관함 상태 목록 조회' })
  @ApiOkResponse({
    description: '보관함 상태 목록',
    schema: {
      example: [
        { id: 1, status: 'OPEN', updatedDate: '2026-02-18T00:00:00.000Z' },
      ],
    },
  })
  findAll() {
    return this.casesService.findAll();
  }

  @Put()
  @ApiOperation({ summary: '보관함 상태 일괄 변경 (DISCONNECTED 제외)' })
  @ApiOkResponse({
    description: '보관함 상태 일괄 변경 결과',
    schema: {
      example: {
        targetStatus: 'OPEN',
        totalCases: 40,
        excludedDisconnectedCount: 2,
        updatedCount: 38,
      },
    },
  })
  replaceAll(@Body() body: UpdateCaseDto) {
    return this.casesService.replaceAll(body);
  }

  @Get(':id')
  @ApiOperation({ summary: '보관함 상태 단건 조회' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '보관함 상태 상세',
    schema: {
      example: { id: 1, status: 'OPEN', updatedDate: '2026-02-18T00:00:00.000Z' },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '보관함 상태 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '수정된 보관함 상태',
    schema: {
      example: { id: 1, status: 'CLOSED', updatedDate: '2026-02-18T01:00:00.000Z' },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCaseDto: UpdateCaseDto,
  ) {
    return this.casesService.update(id, updateCaseDto);
  }
}