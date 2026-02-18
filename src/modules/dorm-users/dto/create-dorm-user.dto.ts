import { ApiProperty } from '@nestjs/swagger';

export class CreateDormUserDto {
  @ApiProperty({ example: 1 })
  roomId: number;

  @ApiProperty({ example: 12 })
  userId: number;

  @ApiProperty({ example: 2026 })
  year: number;

  @ApiProperty({ enum: [1, 2], example: 1 })
  semester: 1 | 2;

  @ApiProperty({ example: 2 })
  bedPosition: number;
}