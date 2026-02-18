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
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DormRoomsService } from './dorms.service';
import {
  DormAssignmentsQueryDto,
  DormAssignmentsUpsertDto,
  DormReportCreateDto,
  DormReportUpdateDto,
} from './dto/dorms.dto';

@ApiTags('dorms')
@Controller('api/dorms')
export class DormsController {
  constructor(private readonly dormRoomsService: DormRoomsService) {}

  @Get('assignments')
  @ApiOperation({ summary: '학기별 기숙사 배정 조회' })
  @ApiOkResponse({
    description: '학기 배정 스냅샷',
    schema: {
      example: {
        year: 2026,
        semester: 1,
        rooms: [
          {
            roomId: 1,
            room: {
              id: 1,
              name: '201호',
              capacity: 4,
              grade: 2,
              dormName: '송죽관',
            },
            members: [
              { userId: 12, bedPosition: 1, user: { id: 12, stuid: 31101, name: '홍길동' } },
            ],
          },
        ],
      },
    },
  })
  findAssignments(@Query() query: DormAssignmentsQueryDto) {
    return this.dormRoomsService.findAssignments(query);
  }

  @Put('assignments')
  @ApiOperation({ summary: '학기별 기숙사 배정 일괄 반영(스냅샷 업서트)' })
  @ApiOkResponse({
    description: '배정 반영 결과',
    schema: {
      example: {
        year: 2026,
        semester: 1,
        roomCount: 10,
        assignedUserCount: 34,
      },
    },
  })
  upsertAssignments(@Body() body: DormAssignmentsUpsertDto) {
    return this.dormRoomsService.upsertAssignments(body);
  }

  @Post('reports')
  @ApiOperation({ summary: '기숙사 고장 신고 생성' })
  @ApiCreatedResponse({
    description: '생성된 고장 신고',
    schema: {
      example: {
        id: 7,
        userId: 12,
        roomId: 3,
        description: '샤워실 수도꼭지가 고장났습니다.',
        imageUrl: 'https://s3.example.com/report-image.jpg',
        imageKey: 'dorm/reports/abc123.jpg',
        status: 'PENDING',
        comment: null,
        user: { id: 12, stuid: 31101, name: '홍길동' },
        room: { id: 3, name: '302호', capacity: 4, grade: 2, dormName: '송죽관' },
      },
    },
  })
  createReport(@Body() body: DormReportCreateDto) {
    return this.dormRoomsService.createReport(body);
  }

  @Get('reports')
  @ApiOperation({ summary: '기숙사 고장 신고 목록 조회' })
  @ApiOkResponse({
    description: '고장 신고 목록',
    schema: {
      example: [
        {
          id: 7,
          userId: 12,
          roomId: 3,
          description: '샤워실 수도꼭지가 고장났습니다.',
          imageUrl: 'https://s3.example.com/report-image.jpg',
          imageKey: 'dorm/reports/abc123.jpg',
          status: 'PENDING',
          comment: null,
          user: { id: 12, stuid: 31101, name: '홍길동' },
          room: { id: 3, name: '302호', capacity: 4, grade: 2, dormName: '송죽관' },
        },
      ],
    },
  })
  findReports() {
    return this.dormRoomsService.findReports();
  }

  @Patch('reports/:id')
  @ApiOperation({ summary: '기숙사 고장 신고 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '수정된 고장 신고',
    schema: {
      example: {
        id: 7,
        userId: 12,
        roomId: 3,
        description: '샤워실 수도꼭지 수리 완료',
        imageUrl: 'https://s3.example.com/report-image.jpg',
        imageKey: 'dorm/reports/abc123.jpg',
        status: 'COMPLETED',
        comment: '수리 완료되었습니다.',
        user: { id: 12, stuid: 31101, name: '홍길동' },
        room: { id: 3, name: '302호', capacity: 4, grade: 2, dormName: '송죽관' },
      },
    },
  })
  updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DormReportUpdateDto,
  ) {
    return this.dormRoomsService.updateReport(id, body);
  }

  @Delete('reports/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '기숙사 고장 신고 삭제' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: '고장 신고 삭제 완료' })
  removeReport(@Param('id', ParseIntPipe) id: number) {
    return this.dormRoomsService.removeReport(id);
  }
}