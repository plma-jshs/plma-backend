import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { SongsService } from "./songs.service";
import {
  SongCreateDto,
  SongCreateResponseDto,
  SongFindAllResponseDto,
  SongIdParamDto,
  SongListQueryDto,
  SongUpdateDto,
  SongUpdateResponseDto,
} from "./dto/songs.schema";

@ApiTags("Songs")
@Controller("songs")
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @ZodResponse({ type: SongCreateResponseDto })
  create(@Body() body: SongCreateDto) {
    return this.songsService.create(body);
  }

  @Get()
  @ZodResponse({ type: SongFindAllResponseDto })
  findAll(@Query() query: SongListQueryDto) {
    return this.songsService.findAll(query);
  }

  @Patch(":id")
  @ZodResponse({ type: SongUpdateResponseDto })
  update(@Param() params: SongIdParamDto, @Body() body: SongUpdateDto) {
    return this.songsService.update(params.id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: SongIdParamDto) {
    return this.songsService.remove(params.id);
  }
}
