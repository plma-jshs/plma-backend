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

  private async ensurePermission(
    authorization: string | undefined,
    cookie: string | undefined,
    requiredPermissions: string[],
  ) {
    const session = await this.sessionService.checkSession({ authorization, cookie });

    const sessionData = session as { isLogined?: unknown; permissions?: unknown };
    const permissions = Array.isArray(sessionData.permissions)
      ? sessionData.permissions.filter((permission): permission is string => typeof permission === 'string')
      : [];

    if (sessionData.isLogined !== true) {
      throw new ForbiddenException('login session is required');
    }

    const hasPermission = requiredPermissions.some((permission) => permissions.includes(permission));
    if (!hasPermission) {
      throw new ForbiddenException('permission is required');
    }
  }

  @Post()
  async create(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensurePermission(authorization, cookie, ['addIAMAccount', 'applyAccess']);
    const payload = parseZod<AccountCreateInput>(accountCreateSchema, body);
    return this.accountsService.create(payload);
  }

  @Get()
  async findAll(
    @Query() query: unknown,
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    await this.ensurePermission(authorization, cookie, ['viewIAMAccounts', 'viewPLMAAccounts']);
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
    await this.ensurePermission(authorization, cookie, ['applyAccess']);
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
    await this.ensurePermission(authorization, cookie, ['applyAccess']);
    const { id } = parseZod<AccountIdParams>(accountIdParamSchema, params);
    return this.accountsService.remove(id);
  }
}