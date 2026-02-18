import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 31101 })
  stuid: number;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 3 })
  grade: number;

  @ApiProperty({ example: 1 })
  class: number;

  @ApiProperty({ example: 1 })
  num: number;

  @ApiPropertyOptional({ example: 0 })
  point?: number;
}