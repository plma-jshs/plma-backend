import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DormRoomCreateDto {
  @ApiProperty({ example: '201호' })
  name: string;

  @ApiProperty({ example: 4 })
  capacity: number;

  @ApiProperty({ example: 2 })
  grade: number;

  @ApiProperty({ enum: ['송죽관', '동백관'], example: '송죽관' })
  dormName: '송죽관' | '동백관';
}

export class DormRoomUpdateDto {
  @ApiPropertyOptional({ example: '201호' })
  name?: string;

  @ApiPropertyOptional({ example: 4 })
  capacity?: number;

  @ApiPropertyOptional({ example: 2 })
  grade?: number;

  @ApiPropertyOptional({ enum: ['송죽관', '동백관'], example: '동백관' })
  dormName?: '송죽관' | '동백관';
}