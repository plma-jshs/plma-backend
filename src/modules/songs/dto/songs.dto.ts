import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class SongCreateDto {
  @ApiProperty({ example: '기상송 제목' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'https://example.com/song.mp3' })
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty({ example: 210 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' })
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export class SongUpdateDto {
  @ApiPropertyOptional({ example: '수정된 기상송 제목' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: 'https://example.com/updated-song.mp3' })
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'APPROVED' })
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}