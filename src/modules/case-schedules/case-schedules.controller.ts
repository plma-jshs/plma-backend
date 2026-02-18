import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CaseSchedulesService } from './case-schedules.service';
import {
  CaseScheduleCreateDto,
  CaseScheduleUpdateDto,
} from './dto/case-schedules.dto';

@ApiTags('CaseSchedules')
@Controller('cases/schedules')
export class CaseSchedulesController {
  constructor(private readonly caseSchedulesService: CaseSchedulesService) {}

  @Post()
  @ApiOperation({ summary: '보관함 스케줄 생성' })
  create(@Body() body: CaseScheduleCreateDto) {
    return this.caseSchedulesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '보관함 스케줄 목록 조회' })
  findAll() {
    return this.caseSchedulesService.findAll();
  }

  @Patch(':scheduleId')
  @ApiOperation({ summary: '보관함 스케줄 수정' })
  @ApiParam({ name: 'scheduleId', type: Number })
  update(
    @Param('scheduleId', ParseIntPipe) id: number,
    @Body() body: CaseScheduleUpdateDto,
  ) {
    return this.caseSchedulesService.update(id, body);
  }

  @Delete(':scheduleId')
  @ApiOperation({ summary: '보관함 스케줄 삭제' })
  @ApiParam({ name: 'scheduleId', type: Number })
  remove(@Param('scheduleId', ParseIntPipe) id: number) {
    return this.caseSchedulesService.remove(id);
  }
}