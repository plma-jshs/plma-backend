import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  Max,
  MaxLength,
  Min,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class DormAssignmentMemberDto {
  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bedPosition: number;
}

export class DormAssignmentRoomDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roomId: number;

  @ApiProperty({ type: [DormAssignmentMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DormAssignmentMemberDto)
  members: DormAssignmentMemberDto[];
}

export class DormAssignmentsUpsertDto {
  @ApiProperty({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({ enum: [1, 2], example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  semester: 1 | 2;

  @ApiProperty({ type: [DormAssignmentRoomDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DormAssignmentRoomDto)
  rooms: DormAssignmentRoomDto[];
}

export class DormAssignmentsQueryDto {
  @ApiProperty({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({ enum: [1, 2], example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  semester: 1 | 2;
}

export class DormReportCreateDto {
  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roomId: number;

  @ApiProperty({ example: '샤워실 수도꼭지가 고장났습니다.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ required: false, example: 'https://s3.example.com/report-image.jpg' })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ required: false, example: 'dorm/reports/abc123.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageKey?: string;
}

export class DormReportUpdateDto {
  @ApiProperty({ required: false, example: '샤워실 배수 문제도 있습니다.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ required: false, example: 'https://s3.example.com/report-image-updated.jpg' })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ required: false, example: 'dorm/reports/updated.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageKey?: string;

  @ApiProperty({ required: false, enum: ['PENDING', 'PROCESSING', 'COMPLETED'], example: 'PROCESSING' })
  @IsOptional()
  @IsIn(['PENDING', 'PROCESSING', 'COMPLETED'])
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED';

  @ApiProperty({ required: false, example: '확인 후 조치 예정입니다.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}