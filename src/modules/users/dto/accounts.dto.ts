import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountCreateDto {
  @ApiProperty({ example: 31101 })
  stuid: number;

  @ApiProperty({ example: 'password123!' })
  password: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiPropertyOptional({ example: 1 })
  studentId?: number;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  phoneNumber?: string;
}

export class AccountUpdateDto {
  @ApiPropertyOptional({ example: 31101 })
  stuid?: number;

  @ApiPropertyOptional({ example: 'new-password123!' })
  password?: string;

  @ApiPropertyOptional({ example: '홍길동' })
  name?: string;

  @ApiPropertyOptional({ example: 1, nullable: true })
  studentId?: number | null;

  @ApiPropertyOptional({ example: '010-9876-5432', nullable: true })
  phoneNumber?: string | null;
}