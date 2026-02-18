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
import { UsersService } from './users.service';
import { AccountCreateDto, AccountUpdateDto } from './dto/accounts.dto';

@ApiTags('Accounts')
@Controller('api/accounts')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '계정 생성' })
  create(@Body() body: AccountCreateDto) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '계정 목록 조회' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':accountId')
  @ApiOperation({ summary: '계정 수정' })
  @ApiParam({ name: 'accountId', type: Number })
  update(
    @Param('accountId', ParseIntPipe) id: number,
    @Body() body: AccountUpdateDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':accountId')
  @ApiOperation({ summary: '계정 삭제' })
  @ApiParam({ name: 'accountId', type: Number })
  remove(@Param('accountId', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}