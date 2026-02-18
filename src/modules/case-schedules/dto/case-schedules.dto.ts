import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsOptional } from 'class-validator';

export class CaseScheduleCreateDto {
  @ApiProperty({ example: '2026-02-18T06:30:00.000Z' })
  @IsISO8601()
  date: string;

  @ApiProperty({ enum: ['OPEN', 'CLOSE'], example: 'OPEN' })
  @IsIn(['OPEN', 'CLOSE'])
  action: 'OPEN' | 'CLOSE';
}

export class CaseScheduleUpdateDto {
  @ApiPropertyOptional({ example: '2026-02-18T06:30:00.000Z' })
  @IsOptional()
  @IsISO8601()
  date?: string;

  @ApiPropertyOptional({ enum: ['OPEN', 'CLOSE'], example: 'CLOSE' })
  @IsOptional()
  @IsIn(['OPEN', 'CLOSE'])
  action?: 'OPEN' | 'CLOSE';
}