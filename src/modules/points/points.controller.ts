import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PointsService } from './points.service';
import {
  PointCreateInput,
  PointIdParams,
  PointListQuery,
  PointReasonCreateInput,
  PointReasonUpdateInput,
  PointStudentsQuery,
  PointUpdateInput,
  pointCreateSchema,
  pointIdParamSchema,
  pointListQuerySchema,
  pointReasonSchema,
  pointReasonUpdateSchema,
  pointStudentsQuerySchema,
  pointUpdateSchema,
} from './dto/points.schema';
import { parseZod } from '@/common/zod/parse-zod';
import { SessionService } from '@/modules/session/session.service';

@ApiTags('Points')
@Controller('api/points')
export class PointsController {
  constructor(
    private readonly pointsService: PointsService,
    private readonly sessionService: SessionService,
  ) {}

  private async getRequesterUserId(
    authorization: string | undefined,
    cookie: string | undefined,
  ) {
    const currentUser = await this.sessionService.getCurrentUser({ authorization, cookie });
    const userId = currentUser?.user?.id;

    if (typeof userId !== 'number' || !Number.isInteger(userId) || userId < 1) {
      throw new UnauthorizedException('login session user is required');
    }

    return userId;
  }

  @Post()
  async create(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
    @Headers('cookie') cookie?: string,
  ) {
    const payload = parseZod<PointCreateInput>(pointCreateSchema, body);
    const requesterUserId = await this.getRequesterUserId(authorization, cookie);
    return this.pointsService.create(payload, requesterUserId);
  }

  @Get()
  findAll(@Query() query: unknown) {
    const payload = parseZod<PointListQuery>(pointListQuerySchema, query);
    return this.pointsService.findAll(payload);
  }

  @Patch(':id')
  update(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<PointIdParams>(pointIdParamSchema, params);
    const payload = parseZod<PointUpdateInput>(pointUpdateSchema, body);
    return this.pointsService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: unknown) {
    const { id } = parseZod<PointIdParams>(pointIdParamSchema, params);
    return this.pointsService.remove(id);
  }

  @Get('students')
  findStudents(@Query() query: unknown) {
    const payload = parseZod<PointStudentsQuery>(pointStudentsQuerySchema, query);
    return this.pointsService.findStudents(payload);
  }

  @Get('students/:id')
  findStudentById(@Param() params: unknown) {
    const { id } = parseZod<PointIdParams>(pointIdParamSchema, params);
    return this.pointsService.findStudentById(id);
  }

  @Get('reasons')
  findReasons() {
    return this.pointsService.findReasons();
  }

  @Post('reasons')
  createReason(@Body() body: unknown) {
    const payload = parseZod<PointReasonCreateInput>(pointReasonSchema, body);
    return this.pointsService.createReason(payload);
  }

  @Patch('reasons/:id')
  updateReason(
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const { id } = parseZod<PointIdParams>(pointIdParamSchema, params);
    const payload = parseZod<PointReasonUpdateInput>(pointReasonUpdateSchema, body);
    return this.pointsService.updateReason(id, payload);
  }

  @Delete('reasons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeReason(@Param() params: unknown) {
    const { id } = parseZod<PointIdParams>(pointIdParamSchema, params);
    return this.pointsService.removeReason(id);
  }
}