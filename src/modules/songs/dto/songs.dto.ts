import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SongCreateDto {
  @ApiProperty({ example: '기상송 제목' })
  title: string;

  @ApiProperty({ example: 'https://example.com/song.mp3' })
  url: string;

  @ApiProperty({ example: 210 })
  duration: number;

  @ApiPropertyOptional({ enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' })
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export class SongUpdateDto {
  @ApiPropertyOptional({ example: '수정된 기상송 제목' })
  title?: string;

  @ApiPropertyOptional({ example: 'https://example.com/updated-song.mp3' })
  url?: string;

  @ApiPropertyOptional({ example: 180 })
  duration?: number;

  @ApiPropertyOptional({ enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'APPROVED' })
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}