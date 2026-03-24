import {
  Body,
  Controller,
  ForbiddenException,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
import { SessionService } from '@/modules/session/session.service';

@ApiTags('Accounts')
@Controller('api/accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly sessionService: SessionService,
  ) {}

  private async ensureAdminSession(
    authorization: string | undefined,
    cookie: string | undefined,
  ) {
    const session = await this.sessionService.checkSession({ authorization, cookie });

    if (!session || typeof session !== 'object') {
      throw new ForbiddenException('admin session is required');
    }

    const sessionData = session as Record<string, unknown>;
    if (sessionData.isLogined !== true || sessionData.jshsus !== true) {
      throw new ForbiddenException('admin session is required');
    }
  }

  @Post()
  async create(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    const payload = parseZod<AccountCreateInput>(accountCreateSchema, body);
    return this.accountsService.create(payload);
  }

  @Get()
  async findAll(
    @Query() query: unknown,
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    const payload = parseZod<AccountListQuery>(accountListQuerySchema, query);
    return this.accountsService.findAll(payload);
  }

  @Patch(':id')
  async update(
    @Param() params: unknown,
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    const { id } = parseZod<AccountIdParams>(accountIdParamSchema, params);
    const payload = parseZod<AccountUpdateInput>(accountUpdateSchema, body);
    return this.accountsService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param() params: unknown,
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensureAdminSession(authorization, cookie);
    const { id } = parseZod<AccountIdParams>(accountIdParamSchema, params);
    return this.accountsService.remove(id);
  }
}