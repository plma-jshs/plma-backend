import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

type SessionHeaders = {
  authorization?: string;
  cookie?: string;
};

@Injectable()
export class SessionService {
  private readonly iamCheckSessionUrl =
    process.env.IAM_CHECK_SESSION_URL ?? 'https://iam.jshsus.kr/check-session';

  constructor(private readonly prisma: PrismaService) {}

  private readonly localUserSelect = {
    id: true,
    stuid: true,
    name: true,
    phoneNumber: true,
    studentId: true,
    student: {
      select: {
        id: true,
        stuid: true,
        name: true,
        grade: true,
        class: true,
        num: true,
        point: true,
      },
    },
  } as const;

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

  private resolveToken(headers: SessionHeaders) {
    const authHeader = headers.authorization?.trim();

    if (authHeader) {
      const [scheme, token] = authHeader.split(/\s+/);

      if (scheme !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid Authorization header format');
      }

      return { token, source: 'authorization' as const };
    }

    const cookieToken = this.parseIamTokenFromCookie(headers.cookie);
    if (cookieToken) {
      return { token: cookieToken, source: 'cookie' as const };
    }

    throw new UnauthorizedException('Missing Authorization header or iam_token cookie');
  }

  public async checkSession(headers: SessionHeaders) {
    const { token, source } = this.resolveToken(headers);

    const requestHeaders: Record<string, string> =
      source === 'authorization'
        ? { authorization: `Bearer ${token}` }
        : { cookie: `iam_token=${token}` };

    let response: Response;

    try {
      response = await fetch(this.iamCheckSessionUrl, {
        method: 'GET',
        headers: requestHeaders,
      });
    } catch {
      throw new BadGatewayException('Failed to connect to IAM check-session endpoint');
    }

    const raw = await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedException(raw || 'Unauthorized');
      }

      throw new BadGatewayException(
        `IAM check-session failed with status ${response.status}`,
      );
    }

    if (!raw) {
      return { isLogined: false };
    }

    try {
      return JSON.parse(raw) as unknown;
    } catch {
      throw new BadGatewayException('Invalid JSON received from IAM');
    }
  }

  public async getCurrentUser(headers: SessionHeaders) {
    const session = await this.checkSession(headers);

    if (!session || typeof session !== 'object') {
      return { isLogined: false, user: null };
    }

    const sessionData = session as Record<string, unknown>;
    if (sessionData.isLogined !== true) {
      return { isLogined: false, user: null };
    }

    const userId = Number(sessionData.userId);
    if (!Number.isInteger(userId) || userId < 1) {
      return { ...sessionData, isLogined: true, user: null };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.localUserSelect,
    });

    return { ...sessionData, isLogined: true, user };
  }
}