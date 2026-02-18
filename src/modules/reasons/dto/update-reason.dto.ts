import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReasonDto {
  @ApiPropertyOptional({ enum: ['PLUS', 'MINUS', 'ETC'], example: 'MINUS' })
  type?: 'PLUS' | 'MINUS' | 'ETC';

  @ApiPropertyOptional({ example: 2 })
  point?: number;

  @ApiPropertyOptional({ example: '지각' })
  comment?: string;
}