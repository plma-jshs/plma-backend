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
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PointsService } from './points.service';
import {
  PointCreateDto,
  PointListQueryDto,
  PointReasonDto,
  PointReasonUpdateDto,
  PointStudentsQueryDto,
  PointUpdateDto,
} from './dto/points.dto';

@ApiTags('Points')
@Controller('api/points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @ApiOperation({ summary: '상벌점 부여' })
  @ApiCreatedResponse({
    description: '생성된 상벌점 기록',
    schema: {
      example: {
        point: {
          id: 10,
          studentId: 1,
          teacherId: 1,
          reasonId: 3,
          point: 3,
          comment: '복도 청소 불량',
          baseDate: '2026-02-18T00:00:00.000Z',
          updatedDate: '2026-02-18T00:00:00.000Z',
          student: { id: 1, stuid: 31101, name: '홍길동' },
          teacher: { id: 1, stuid: 10001, name: '교사A' },
          reason: { id: 3, type: 'MINUS', point: 3, comment: '복도 청소 불량' },
        },
      },
    },
  })
  create(@Body() body: PointCreateDto) {
    return this.pointsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '학생의 상벌점 기록 목록 불러오기' })
  @ApiQuery({ name: 'stuId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiOkResponse({
    description: '상벌점 기록 목록',
    schema: {
      example: {
        points: [
          {
            id: 10,
            studentId: 1,
            teacherId: 1,
            reasonId: 3,
            point: 3,
            comment: '복도 청소 불량',
            baseDate: '2026-02-18T00:00:00.000Z',
            updatedDate: '2026-02-18T00:00:00.000Z',
            student: { id: 1, stuid: 31101, name: '홍길동' },
            teacher: { id: 1, stuid: 10001, name: '교사A' },
            reason: { id: 3, type: 'MINUS', point: 3, comment: '복도 청소 불량' },
          },
        ],
      },
    },
  })
  findAll(@Query() query: PointListQueryDto) {
    return this.pointsService.findAll(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: '상벌점 기록 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '수정된 상벌점 기록',
    schema: {
      example: {
        point: {
          id: 10,
          studentId: 1,
          teacherId: 1,
          reasonId: 3,
          point: 2,
          comment: '지각 5분',
          baseDate: '2026-02-18T00:00:00.000Z',
          updatedDate: '2026-02-18T01:23:45.000Z',
          student: { id: 1, stuid: 31101, name: '홍길동' },
          teacher: { id: 1, stuid: 10001, name: '교사A' },
          reason: { id: 3, type: 'MINUS', point: 3, comment: '복도 청소 불량' },
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PointUpdateDto,
  ) {
    return this.pointsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '상벌점 기록 삭제' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: '상벌점 기록 삭제 완료' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pointsService.remove(id);
  }

  @Get('students')
  @ApiOperation({ summary: '전체 상벌점 현황 가져오기' })
  @ApiQuery({ name: 'grade', required: false, type: Number })
  @ApiQuery({ name: 'class', required: false, type: Number })
  @ApiQuery({ name: 'number', required: false, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiOkResponse({
    description: '상벌점 현황 학생 목록',
    schema: {
      example: {
        students: [
          { id: 1, stuid: 31101, name: '홍길동', grade: 3, class: 1, num: 1, point: -3 },
        ],
      },
    },
  })
  findStudents(@Query() query: PointStudentsQueryDto) {
    return this.pointsService.findStudents(query);
  }

  @Get('students/:id')
  @ApiOperation({ summary: '특정 학생 상벌점 상세 조회' })
  @ApiParam({ name: 'id', type: Number, description: 'studentId (PK)' })
  @ApiOkResponse({
    description: '학생 상벌점 상세',
    schema: {
      example: {
        student: { id: 1, stuid: 31101, name: '홍길동', grade: 3, class: 1, num: 1, point: -3 },
        points: [
          {
            id: 10,
            studentId: 1,
            teacherId: 1,
            reasonId: 3,
            point: 2,
            comment: '지각 5분',
            baseDate: '2026-02-18T00:00:00.000Z',
            updatedDate: '2026-02-18T01:23:45.000Z',
            student: { id: 1, stuid: 31101, name: '홍길동' },
            teacher: { id: 1, stuid: 10001, name: '교사A' },
            reason: { id: 3, type: 'MINUS', point: 3, comment: '복도 청소 불량' },
          },
        ],
      },
    },
  })
  findStudentById(@Param('id', ParseIntPipe) id: number) {
    return this.pointsService.findStudentById(id);
  }

  @Get('reasons')
  @ApiOperation({ summary: '상벌점 사유 목록 가져오기' })
  @ApiOkResponse({
    description: '상벌점 사유 목록',
    schema: {
      example: {
        reasons: [
          { id: 3, type: 'MINUS', point: 3, comment: '복도 청소 불량' },
        ],
      },
    },
  })
  findReasons() {
    return this.pointsService.findReasons();
  }

  @Post('reasons')
  @ApiOperation({ summary: '상벌점 사유 등록' })
  @ApiCreatedResponse({
    description: '생성된 상벌점 사유',
    schema: {
      example: {
        reason: { id: 3, type: 'MINUS', point: 3, comment: '복도 청소 불량' },
      },
    },
  })
  createReason(@Body() body: PointReasonDto) {
    return this.pointsService.createReason(body);
  }

  @Patch('reasons/:id')
  @ApiOperation({ summary: '상벌점 사유 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '수정된 상벌점 사유',
    schema: {
      example: {
        reason: { id: 3, type: 'MINUS', point: 2, comment: '지각' },
      },
    },
  })
  updateReason(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PointReasonUpdateDto,
  ) {
    return this.pointsService.updateReason(id, body);
  }

  @Delete('reasons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '상벌점 사유 삭제' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: '상벌점 사유 삭제 완료' })
  removeReason(@Param('id', ParseIntPipe) id: number) {
    return this.pointsService.removeReason(id);
  }
}