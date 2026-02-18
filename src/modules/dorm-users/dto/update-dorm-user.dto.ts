import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDormUserDto {
  @ApiPropertyOptional({ example: 1 })
  roomId?: number;

  @ApiPropertyOptional({ example: 12 })
  userId?: number;

  @ApiPropertyOptional({ example: 2026 })
  year?: number;

  @ApiPropertyOptional({ enum: [1, 2], example: 2 })
  semester?: 1 | 2;

  @ApiPropertyOptional({ example: 1 })
  bedPosition?: number;
}