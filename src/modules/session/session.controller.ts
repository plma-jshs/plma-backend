import { Controller, Get, Headers } from "@nestjs/common";
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { SessionService } from "./session.service";
import {
  CheckSessionResponseDto,
  GetCurrentUserResponseDto,
} from "./dto/session.schema";

@ApiTags("Session")
@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get("user")
  @ApiOperation({ summary: "현재 로그인 세션 기준 사용자 조회" })
  @ZodResponse({ type: GetCurrentUserResponseDto })
  @ApiUnauthorizedResponse({
    description:
      "Authorization 헤더 또는 iam_token 쿠키가 없거나 유효하지 않음",
  })
  getCurrentUser(
    @Headers("authorization") authorization?: string,
    @Headers("cookie") cookie?: string,
  ) {
    return this.sessionService.getCurrentUser({ authorization, cookie });
  }

  @Get("check-session")
  @ApiOperation({ summary: "IAM 세션 검증" })
  @ZodResponse({ type: CheckSessionResponseDto })
  @ApiUnauthorizedResponse({
    description:
      "Authorization 헤더 또는 iam_token 쿠키가 없거나 유효하지 않음",
  })
  async checkSession(
    @Headers("authorization") authorization?: string,
    @Headers("cookie") cookie?: string,
  ) {
    return this.sessionService.getCurrentUser({ authorization, cookie });
  }
}
