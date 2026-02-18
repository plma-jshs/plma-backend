import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDormReportDto {
  @ApiPropertyOptional({ example: 12 })
  userId?: number;

  @ApiPropertyOptional({ example: 3 })
  roomId?: number;

  @ApiPropertyOptional({ example: '샤워실 배수 문제도 있습니다.' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://s3.example.com/report-image-updated.jpg', nullable: true })
  imageUrl?: string | null;

  @ApiPropertyOptional({ example: 'dorm/reports/updated.jpg', nullable: true })
  imageKey?: string | null;

  @ApiPropertyOptional({ enum: ['PENDING', 'PROCESSING', 'COMPLETED'], example: 'COMPLETED' })
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED';

  @ApiPropertyOptional({ example: '수리 완료되었습니다.', nullable: true })
  comment?: string | null;
}