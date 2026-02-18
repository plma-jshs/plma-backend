import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PointsService } from './points.service';
import {
  PointCreateDto,
  PointListQueryDto,
  PointReasonDto,
  PointReasonUpdateDto,
  PointStudentsQueryDto,
  PointUpdateDto,
} from './dto/points.dto'

@ApiTags('Points')
@Controller('api/points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @ApiOperation({ summary: '상벌점 부여' })
  create(@Body() body: PointCreateDto) {
    return this.pointsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '학생의 상벌점 기록 목록 불러오기' })
  @ApiQuery({ name: 'stuId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  findAll(@Query() query: PointListQueryDto) {
    return this.pointsService.findAll(query);
  }

  @Patch(':pointId')
  @ApiOperation({ summary: '상벌점 기록 수정' })
  @ApiParam({ name: 'pointId', type: Number })
  update(
    @Param('pointId', ParseIntPipe) id: number,
    @Body() body: PointUpdateDto,
  ) {
    return this.pointsService.update(id, body);
  }

  @Delete(':pointId')
  @ApiOperation({ summary: '상벌점 기록 삭제' })
  @ApiParam({ name: 'pointId', type: Number })
  remove(@Param('pointId', ParseIntPipe) id: number) {
    return this.pointsService.remove(id);
  }

  @Get('students')
  @ApiOperation({ summary: '전체 상벌점 현황 가져오기' })
  @ApiQuery({ name: 'grade', required: false, type: Number })
  @ApiQuery({ name: 'class', required: false, type: Number })
  @ApiQuery({ name: 'number', required: false, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  findStudents(@Query() query: PointStudentsQueryDto) {
    return this.pointsService.findStudents(query);
  }

  @Get('reasons')
  @ApiOperation({ summary: '상벌점 사유 목록 가져오기' })
  findReasons() {
    return this.pointsService.findReasons();
  }

  @Post('reasons')
  @ApiOperation({ summary: '상벌점 사유 등록' })
  createReason(@Body() body: PointReasonDto) {
    return this.pointsService.createReason(body);
  }

  @Patch('reasons/:reasonId')
  @ApiOperation({ summary: '상벌점 사유 수정' })
  @ApiParam({ name: 'reasonId', type: Number })
  updateReason(
    @Param('reasonId', ParseIntPipe) id: number,
    @Body() body: PointReasonUpdateDto,
  ) {
    return this.pointsService.updateReason(id, body);
  }

  @Delete('reasons/:reasonId')
  @ApiOperation({ summary: '상벌점 사유 삭제' })
  @ApiParam({ name: 'reasonId', type: Number })
  removeReason(@Param('reasonId', ParseIntPipe) id: number) {
    return this.pointsService.removeReason(id);
  }
}