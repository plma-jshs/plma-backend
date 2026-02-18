import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import {
  AccountIdParams,
  AccountCreateInput,
  AccountListQuery,
  AccountUpdateInput,
  accountCreateSchema,
  accountIdParamSchema,
  accountListQuerySchema,
  accountUpdateSchema,
} from './dto/accounts.schema';
import { parseZod } from '@/common/zod/parse-zod';

@ApiTags('Accounts')
@Controller('api/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()  create(@Body() body: unknown) {
    const payload = parseZod<AccountCreateInput>(accountCreateSchema, body);
    return this.accountsService.create(payload);
  }

  @Get()  findAll(@Query() query: unknown) {
    const payload = parseZod<AccountListQuery>(accountListQuerySchema, query);
    return this.accountsService.findAll(payload);
  }

  @Patch(':id')  update(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<AccountIdParams>(accountIdParamSchema, params);
    const payload = parseZod<AccountUpdateInput>(accountUpdateSchema, body);
    return this.accountsService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)  remove(@Param() params: unknown) {
    const { id } = parseZod<AccountIdParams>(accountIdParamSchema, params);
    return this.accountsService.remove(id);
  }
}