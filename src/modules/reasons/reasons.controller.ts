import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReasonsService } from './reasons.service';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';

@ApiTags('Reasons')
@Controller('reasons')
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @Post()
  @ApiOperation({ summary: '사유 생성' })
  create(@Body() createReasonDto: CreateReasonDto) {
    return this.reasonsService.create(createReasonDto);
  }

  @Get()
  @ApiOperation({ summary: '사유 목록 조회' })
  findAll() {
    return this.reasonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '사유 단건 조회' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reasonsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사유 수정' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReasonDto: UpdateReasonDto,
  ) {
    return this.reasonsService.update(id, updateReasonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사유 삭제' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reasonsService.remove(id);
  }
}