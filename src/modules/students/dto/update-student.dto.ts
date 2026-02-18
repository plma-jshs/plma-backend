import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 31101 })
  stuid?: number;

  @ApiPropertyOptional({ example: '홍길동' })
  name?: string;

  @ApiPropertyOptional({ example: 3 })
  grade?: number;

  @ApiPropertyOptional({ example: 1 })
  class?: number;

  @ApiPropertyOptional({ example: 1 })
  num?: number;

  @ApiPropertyOptional({ example: 5 })
  point?: number;
}