import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class PointListQueryDto {
  @ApiPropertyOptional({ example: 31101 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stuId?: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}

export class PointCreateDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  studentId: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  reasonId: number;

  @ApiProperty({ example: 3, description: '사유 템플릿 기반으로 최종 적용할 점수' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  point: number;

  @ApiProperty({ example: '복도 청소 불량', description: '사유 템플릿 기반으로 최종 적용할 상세 내용' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  comment: string;
}

export class PointUpdateDto {
  @ApiProperty({ example: 3, description: '변경할 사유 ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  reasonId: number;

  @ApiProperty({ example: 2, description: '최종 적용 점수' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  point: number;

  @ApiProperty({ example: '지각 5분', description: '최종 적용 상세 내용' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  comment: string;
}

export class PointStudentsQueryDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  grade?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  class?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  number?: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}

export class PointReasonDto {
  @ApiProperty({ enum: ['PLUS', 'MINUS', 'ETC'], example: 'PLUS' })
  @IsString()
  @IsIn(['PLUS', 'MINUS', 'ETC'])
  type: 'PLUS' | 'MINUS' | 'ETC';

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  point: number;

  @ApiProperty({ example: '복도 청소 불량' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  comment: string;
}

export class PointReasonUpdateDto {
  @ApiPropertyOptional({ enum: ['PLUS', 'MINUS', 'ETC'], example: 'MINUS' })
  @IsOptional()
  @IsString()
  @IsIn(['PLUS', 'MINUS', 'ETC'])
  type?: 'PLUS' | 'MINUS' | 'ETC';

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  point?: number;

  @ApiPropertyOptional({ example: '지각' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  comment?: string;
}