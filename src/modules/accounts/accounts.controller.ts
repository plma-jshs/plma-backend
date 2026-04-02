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
import { AccountsService } from "./accounts.service";
import {
  AccountCreateDto,
  AccountCreateResponseDto,
  AccountFindAllResponseDto,
  AccountFindOneResponseDto,
  AccountIdParamDto,
  AccountListQueryDto,
  AccountUpdateDto,
  AccountUpdateResponseDto,
} from "./dto/accounts.schema";
import { Permissions } from "@/common/auth/permissions.decorator";

@ApiTags("Accounts")
@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions("addIAMAccount", "applyAccess")
  @ZodResponse({ type: AccountCreateResponseDto })
  async create(@Body() body: AccountCreateDto) {
    return this.accountsService.create(body);
  }

  @Get()
  @Permissions("viewIAMAccounts", "viewPLMAAccounts")
  @ZodResponse({ type: AccountFindAllResponseDto })
  async findAll(@Query() query: AccountListQueryDto) {
    return this.accountsService.findAll(query);
  }

  @Get(":id")
  @Permissions("viewIAMAccounts", "viewPLMAAccounts")
  @ZodResponse({ type: AccountFindOneResponseDto })
  async findOne(@Param() params: AccountIdParamDto) {
    return this.accountsService.findOne(params.id);
  }

  @Patch(":id")
  @Permissions("applyAccess")
  @ZodResponse({ type: AccountUpdateResponseDto })
  async update(
    @Param() params: AccountIdParamDto,
    @Body() body: AccountUpdateDto,
  ) {
    return this.accountsService.update(params.id, body);
  }

  @Delete(":id")
  @Permissions("applyAccess")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: AccountIdParamDto) {
    return this.accountsService.remove(params.id);
  }
}
