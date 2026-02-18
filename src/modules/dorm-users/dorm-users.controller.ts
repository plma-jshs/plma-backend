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
import { DormUsersService } from './dorm-users.service';
import { CreateDormUserDto } from './dto/create-dorm-user.dto';
import { UpdateDormUserDto } from './dto/update-dorm-user.dto';

@ApiTags('DormUsers')
@Controller('dorm-users')
export class DormUsersController {
  constructor(private readonly dormUsersService: DormUsersService) {}

  @Post()
  @ApiOperation({ summary: '기숙사 사용자 배정 생성' })
  create(@Body() createDormUserDto: CreateDormUserDto) {
    return this.dormUsersService.create(createDormUserDto);
  }

  @Get()
  @ApiOperation({ summary: '기숙사 사용자 배정 목록 조회' })
  findAll() {
    return this.dormUsersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '기숙사 사용자 배정 단건 조회' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dormUsersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '기숙사 사용자 배정 수정' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDormUserDto: UpdateDormUserDto,
  ) {
    return this.dormUsersService.update(id, updateDormUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '기숙사 사용자 배정 삭제' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dormUsersService.remove(id);
  }
}