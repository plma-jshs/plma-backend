import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDormReportDto {
  @ApiProperty({ example: 12 })
  userId: number;

  @ApiProperty({ example: 3 })
  roomId: number;

  @ApiProperty({ example: '샤워실 수도꼭지가 고장났습니다.' })
  description: string;

  @ApiPropertyOptional({ example: 'https://s3.example.com/report-image.jpg' })
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'dorm/reports/abc123.jpg' })
  imageKey?: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'PROCESSING', 'COMPLETED'], example: 'PENDING' })
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED';

  @ApiPropertyOptional({ example: '확인 후 조치 예정입니다.' })
  comment?: string;
}