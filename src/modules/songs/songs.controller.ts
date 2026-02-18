import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SongsService } from './songs.service';
import {
  SongCreateInput,
  SongIdParams,
  SongUpdateInput,
  songCreateSchema,
  songIdParamSchema,
  songUpdateSchema,
} from './dto/songs.schema';
import { parseZod } from '@/common/zod/parse-zod';

@ApiTags('Songs')
@Controller('api/songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  create(@Body() body: unknown) {
    const payload = parseZod<SongCreateInput>(songCreateSchema, body);
    return this.songsService.create(payload);
  }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  @Patch(':id')
  update(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<SongIdParams>(songIdParamSchema, params);
    const payload = parseZod<SongUpdateInput>(songUpdateSchema, body);
    return this.songsService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: unknown) {
    const { id } = parseZod<SongIdParams>(songIdParamSchema, params);
    return this.songsService.remove(id);
  }
}