import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SessionService } from '../session.service';

type RequestWithUserInfo = Request & {
  user_info?: unknown;
};

@Injectable()
export class CheckSessionMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  private parseIamTokenFromCookie(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return undefined;
    }

    const cookiePair = cookieHeader
      .split(';')
      .map((chunk) => chunk.trim())
      .find((chunk) => chunk.startsWith('iam_token='));

    if (!cookiePair) {
      return undefined;
    }

    const token = cookiePair.slice('iam_token='.length).trim();
    return token || undefined;
  }

  async use(req: RequestWithUserInfo, _res: Response, next: NextFunction) {
    const token = this.parseIamTokenFromCookie(req.headers.cookie);

    if (!token) {
      throw new UnauthorizedException('Missing iam_token cookie');
    }

    req.user_info = await this.sessionService.checkSessionByToken(token);
    next();
  }
}