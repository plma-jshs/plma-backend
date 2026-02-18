import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CaseSchedulesService } from './case-schedules.service';
import {
  CaseScheduleCreateDto,
  CaseScheduleUpdateDto,
} from './dto/case-schedules.dto';

@ApiTags('Cases/Schedules')
@Controller('api/remote/cases/schedules')
export class CaseSchedulesController {
  constructor(private readonly caseSchedulesService: CaseSchedulesService) {}

  @Post()
  @ApiOperation({ summary: '보관함 스케줄 생성' })
  @ApiCreatedResponse({
    description: '생성된 보관함 스케줄',
    schema: {
      example: { id: 1, date: '2026-02-18T06:30:00.000Z', action: 'OPEN' },
    },
  })
  create(@Body() body: CaseScheduleCreateDto) {
    return this.caseSchedulesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '보관함 스케줄 목록 조회' })
  @ApiOkResponse({
    description: '보관함 스케줄 목록',
    schema: {
      example: [{ id: 1, date: '2026-02-18T06:30:00.000Z', action: 'OPEN' }],
    },
  })
  findAll() {
    return this.caseSchedulesService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '보관함 스케줄 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '수정된 보관함 스케줄',
    schema: {
      example: { id: 1, date: '2026-02-18T22:00:00.000Z', action: 'CLOSE' },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CaseScheduleUpdateDto,
  ) {
    return this.caseSchedulesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '보관함 스케줄 삭제' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: '보관함 스케줄 삭제 완료' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.caseSchedulesService.remove(id);
  }
}