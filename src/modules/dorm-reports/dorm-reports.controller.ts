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
import { DormReportsService } from './dorm-reports.service';
import { CreateDormReportDto } from './dto/create-dorm-report.dto';
import { UpdateDormReportDto } from './dto/update-dorm-report.dto';

@ApiTags('DormReports')
@Controller('dorm-reports')
export class DormReportsController {
  constructor(private readonly dormReportsService: DormReportsService) {}

  @Post()
  @ApiOperation({ summary: '기숙사 민원 생성' })
  create(@Body() createDormReportDto: CreateDormReportDto) {
    return this.dormReportsService.create(createDormReportDto);
  }

  @Get()
  @ApiOperation({ summary: '기숙사 민원 목록 조회' })
  findAll() {
    return this.dormReportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '기숙사 민원 단건 조회' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dormReportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '기숙사 민원 수정' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDormReportDto: UpdateDormReportDto,
  ) {
    return this.dormReportsService.update(id, updateDormReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '기숙사 민원 삭제' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dormReportsService.remove(id);
  }
}