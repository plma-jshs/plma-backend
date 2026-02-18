import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class AccountCreateDto {
  @ApiProperty({ example: 31101 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stuid: number;

  @ApiProperty({ example: 'password123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiProperty({ example: '홍길동' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  studentId?: number;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  @Matches(/^01[0-9]-?\d{3,4}-?\d{4}$/)
  phoneNumber?: string;
}

export class AccountUpdateDto {
  @ApiPropertyOptional({ example: 31101 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stuid?: number;

  @ApiPropertyOptional({ example: 'new-password123!' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72)
  password?: string;

  @ApiPropertyOptional({ example: '홍길동' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name?: string;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  studentId?: number | null;

  @ApiPropertyOptional({ example: '010-9876-5432', nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^01[0-9]-?\d{3,4}-?\d{4}$/)
  phoneNumber?: string | null;
}

export class AccountListQueryDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}