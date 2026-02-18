import { ApiProperty } from '@nestjs/swagger';

export class CreateReasonDto {
  @ApiProperty({ enum: ['PLUS', 'MINUS', 'ETC'], example: 'PLUS' })
  type: 'PLUS' | 'MINUS' | 'ETC';

  @ApiProperty({ example: 3 })
  point: number;

  @ApiProperty({ example: '복도 청소 불량' })
  comment: string;
}