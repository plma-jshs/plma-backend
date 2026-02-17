import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { ViewPointResponseDto } from './dto/point.dto';

@ApiTags('Points') // Swagger에서 그룹화
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('view')
  @ApiOperation({ summary: '내 포인트 보기' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 포인트를 조회함',
    type: ViewPointResponseDto,
  })
  view() {
    const point = this.pointsService.findOne();
    return { point };
  }
}