import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CaseScheduleCreateDto {
  @ApiProperty({ example: '2026-02-18T06:30:00.000Z' })
  date: string;

  @ApiProperty({ enum: ['OPEN', 'CLOSE'], example: 'OPEN' })
  action: 'OPEN' | 'CLOSE';
}

export class CaseScheduleUpdateDto {
  @ApiPropertyOptional({ example: '2026-02-18T06:30:00.000Z' })
  date?: string;

  @ApiPropertyOptional({ enum: ['OPEN', 'CLOSE'], example: 'CLOSE' })
  action?: 'OPEN' | 'CLOSE';
}