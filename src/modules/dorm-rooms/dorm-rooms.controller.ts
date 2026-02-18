import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DormRoomsService } from './dorm-rooms.service';
import { DormRoomCreateDto } from './dto/dorm-rooms.dto';

@ApiTags('DormRooms')
@Controller('api/dorms')
export class DormRoomsController {
  constructor(private readonly dormRoomsService: DormRoomsService) {}

  @Post()
  @ApiOperation({ summary: '기숙사 호실 생성' })
  create(@Body() body: DormRoomCreateDto) {
    return this.dormRoomsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '기숙사 호실 목록 조회' })
  findAll() {
    return this.dormRoomsService.findAll();
  }

  @Put()
  @ApiOperation({ summary: '기숙사 호실 일괄 갱신' })
  replaceAll(@Body() body: DormRoomCreateDto[]) {
    return this.dormRoomsService.replaceAll(body);
  }
}