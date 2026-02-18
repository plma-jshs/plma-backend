import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCaseDto {
  @ApiPropertyOptional({ enum: ['OPEN', 'CLOSED', 'DISCONNECTED'], example: 'OPEN' })
  status?: 'OPEN' | 'CLOSED' | 'DISCONNECTED';
}