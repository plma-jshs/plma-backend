import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GUARDS_METADATA } from "@nestjs/common/constants";
import { SessionService } from "@/modules/session/session.service";
import { AuthGuard } from "@/common/auth/auth.guard";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { extractSessionHeaders } from "@/common/http/session-headers";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ headers?: import("http").IncomingHttpHeaders }>();

    const session = await this.sessionService.checkSession(
      extractSessionHeaders(request.headers),
    );

    const sessionData = (session ?? {}) as {
      isLogined?: unknown;
      permissions?: unknown;
    };

    const mergedGuards = this.reflector.getAllAndMerge<unknown[]>(
      GUARDS_METADATA,
      [context.getHandler(), context.getClass()],
    );
    const handlerGuards = Reflect.getMetadata(
      GUARDS_METADATA,
      context.getHandler(),
    ) as unknown[] | undefined;
    const classGuards = Reflect.getMetadata(
      GUARDS_METADATA,
      context.getClass(),
    ) as unknown[] | undefined;

    const guards = [
      ...(Array.isArray(mergedGuards) ? mergedGuards : []),
      ...(Array.isArray(handlerGuards) ? handlerGuards : []),
      ...(Array.isArray(classGuards) ? classGuards : []),
    ];

    const hasAuthGuard = guards.some(
      (guard) =>
        guard === AuthGuard ||
        (guard as { name?: string })?.name === AuthGuard.name ||
        (guard as { constructor?: { name?: string } })?.constructor?.name ===
          AuthGuard.name,
    );

    const permissions = Array.isArray(sessionData.permissions)
      ? sessionData.permissions.filter(
          (permission): permission is string => typeof permission === "string",
        )
      : [];

    if (sessionData.isLogined !== true) {
      if (hasAuthGuard) {
        return true;
      }

      throw new ForbiddenException("login session is required");
    }

    const hasPermission = requiredPermissions.some((permission) =>
      permissions.includes(permission),
    );
    if (!hasPermission) {
      throw new ForbiddenException("permission is required");
    }

    return true;
  }
}
