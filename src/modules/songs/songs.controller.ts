import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SongsService } from './songs.service';
import { SongCreateDto, SongUpdateDto } from './dto/songs.dto';

@ApiTags('Songs')
@Controller('api/remote/songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @ApiOperation({ summary: '기상곡 등록' })
  @ApiCreatedResponse({
    description: '생성된 기상곡',
    schema: {
      example: {
        id: 25,
        title: 'New Day',
        url: 'https://example.com/song.mp3',
        duration: 210,
        status: 'PENDING',
      },
    },
  })
  create(@Body() body: SongCreateDto) {
    return this.songsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '기상곡 목록 조회' })
  @ApiOkResponse({
    description: '기상곡 목록',
    schema: {
      example: [
        {
          id: 25,
          title: 'New Day',
          url: 'https://example.com/song.mp3',
          duration: 210,
          status: 'PENDING',
        },
      ],
    },
  })
  findAll() {
    return this.songsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '기상곡 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '수정된 기상곡',
    schema: {
      example: {
        id: 25,
        title: 'New Day (Remix)',
        url: 'https://example.com/song.mp3',
        duration: 220,
        status: 'APPROVED',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SongUpdateDto,
  ) {
    return this.songsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '기상곡 삭제' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: '기상곡 삭제 완료' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.remove(id);
  }
}