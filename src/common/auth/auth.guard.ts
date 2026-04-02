import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { SessionService } from "@/modules/session/session.service";
import { extractSessionHeaders } from "@/common/http/session-headers";

type CurrentUser = {
  id: number;
  stuid: number;
  name: string;
  phoneNumber: string | null;
  studentId: number | null;
  student?: {
    id: number;
    stuid: number;
    name: string;
    grade: number;
    class: number;
    num: number;
    point: number;
  } | null;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers?: import("http").IncomingHttpHeaders;
      currentUser?: CurrentUser;
    }>();

    const currentUserResponse = await this.sessionService.getCurrentUser(
      extractSessionHeaders(request.headers),
    );

    const user =
      currentUserResponse?.user ??
      (await this.sessionService.syncUserFromSession(currentUserResponse));

    if (
      !user ||
      typeof user.id !== "number" ||
      !Number.isInteger(user.id) ||
      user.id < 1
    ) {
      throw new UnauthorizedException("login session user is required");
    }

    request.currentUser = user;
    return true;
  }
}
