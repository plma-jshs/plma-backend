import { Injectable } from '@nestjs/common';
import { ViewPointResponseDto } from './dto/point.dto';

@Injectable()
export class PointsService {
  findOne(): ViewPointResponseDto {
    return {
      point: {
        id: 1,
        studentId: 101,
        teacherId: 202,
        reason: {
            id: 5,
            type: "PLUS",
            point: 10,
            comment: '수업 참여 우수',
        },
        baseDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
    },
    };
  }
}