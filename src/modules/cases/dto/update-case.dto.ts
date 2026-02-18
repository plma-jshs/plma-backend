import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateCaseDto {
  @ApiPropertyOptional({ enum: ['OPEN', 'CLOSED', 'DISCONNECTED'], example: 'OPEN' })
  @IsOptional()
  @IsIn(['OPEN', 'CLOSED', 'DISCONNECTED'])
  status?: 'OPEN' | 'CLOSED' | 'DISCONNECTED';
}