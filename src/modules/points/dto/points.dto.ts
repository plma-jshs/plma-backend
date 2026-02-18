import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PointListQueryDto {
  @ApiPropertyOptional({ example: 31101 })
  stuId?: number;

  @ApiProperty({ example: 1 })
  page: number;
}

export class PointCreateDto {
  @ApiProperty({ example: 1 })
  studentId: number;

  @ApiProperty({ example: 3 })
  reasonId: number;

  @ApiProperty({ example: 5 })
  point: number;

  @ApiProperty({ example: '복도 청소 불량' })
  comment: string;
}

export class PointUpdateDto {
  @ApiPropertyOptional({ example: 3 })
  reasonId?: number;

  @ApiPropertyOptional({ example: 5 })
  point?: number;

  @ApiPropertyOptional({ example: '복도 청소 불량' })
  comment?: string;
}

export class PointStudentsQueryDto {
  @ApiPropertyOptional({ example: 2 })
  grade?: number;

  @ApiPropertyOptional({ example: 1 })
  class?: number;

  @ApiPropertyOptional({ example: 10 })
  number?: number;

  @ApiProperty({ example: 1 })
  page: number;
}

export class PointReasonDto {
  @ApiProperty({ enum: ['PLUS', 'MINUS', 'ETC'], example: 'PLUS' })
  type: 'PLUS' | 'MINUS' | 'ETC';

  @ApiProperty({ example: 3 })
  point: number;

  @ApiProperty({ example: '복도 청소 불량' })
  comment: string;
}

export class PointReasonUpdateDto {
  @ApiPropertyOptional({ enum: ['PLUS', 'MINUS', 'ETC'], example: 'MINUS' })
  type?: 'PLUS' | 'MINUS' | 'ETC';

  @ApiPropertyOptional({ example: 2 })
  point?: number;

  @ApiPropertyOptional({ example: '지각' })
  comment?: string;
}