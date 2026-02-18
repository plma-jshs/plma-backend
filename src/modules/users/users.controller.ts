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
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  AccountCreateDto,
  AccountListQueryDto,
  AccountUpdateDto,
} from './dto/accounts.dto';

@ApiTags('Accounts')
@Controller('api/accounts')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '계정 생성' })
  @ApiCreatedResponse({
    description: '생성된 계정',
    schema: {
      example: {
        id: 12,
        stuid: 31101,
        name: '홍길동',
        phoneNumber: '010-1234-5678',
        studentId: 1,
        student: { id: 1, stuid: 31101, name: '홍길동', grade: 3, class: 1, num: 1, point: 0 },
      },
    },
  })
  create(@Body() body: AccountCreateDto) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '계정 목록 조회' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiOkResponse({
    description: '계정 목록',
    schema: {
      example: [
        {
          id: 12,
          stuid: 31101,
          name: '홍길동',
          phoneNumber: '010-1234-5678',
          studentId: 1,
          student: { id: 1, stuid: 31101, name: '홍길동', grade: 3, class: 1, num: 1, point: 0 },
        },
      ],
    },
  })
  findAll(@Query() query: AccountListQueryDto) {
    return this.usersService.findAll(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: '계정 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: '수정된 계정',
    schema: {
      example: {
        id: 12,
        stuid: 31101,
        name: '홍길동',
        phoneNumber: '010-9876-5432',
        studentId: 1,
        student: { id: 1, stuid: 31101, name: '홍길동', grade: 3, class: 1, num: 1, point: 0 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AccountUpdateDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '계정 삭제' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: '계정 삭제 완료' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}