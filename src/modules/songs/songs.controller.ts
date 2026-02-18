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
import { SongsService } from './songs.service';
import { SongCreateDto, SongUpdateDto } from './dto/songs.dto';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @ApiOperation({ summary: '기상곡 등록' })
  create(@Body() body: SongCreateDto) {
    return this.songsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '기상곡 목록 조회' })
  findAll() {
    return this.songsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '기상곡 수정' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SongUpdateDto,
  ) {
    return this.songsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '기상곡 삭제' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.remove(id);
  }
}