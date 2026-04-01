import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import { users } from "@/db/schema";
import { SessionHeaders } from "@/common/http/session-headers";

@Injectable()
export class SessionService {
  private readonly iamCheckSessionUrl = (() => {
    const value = process.env.IAM_CHECK_SESSION_URL;
    if (!value) {
      throw new Error("IAM_CHECK_SESSION_URL is not defined");
    }

    return value;
  })();

  constructor(private readonly db: DbService) {}

  private parseIamTokenFromCookie(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return undefined;
    }

    const cookiePair = cookieHeader
      .split(";")
      .map((chunk) => chunk.trim())
      .find((chunk) => chunk.startsWith("iam_token="));

    if (!cookiePair) {
      return undefined;
    }

    const token = cookiePair.slice("iam_token=".length).trim();
    return token || undefined;
  }

  private resolveToken(headers: SessionHeaders) {
    const authHeader = headers.authorization?.trim();

    if (authHeader) {
      const [scheme, token] = authHeader.split(/\s+/);

      if (scheme !== "Bearer" || !token) {
        return undefined;
      }

      return { token, source: "authorization" as const };
    }

    const cookieToken = this.parseIamTokenFromCookie(headers.cookie);
    if (cookieToken) {
      return { token: cookieToken, source: "cookie" as const };
    }

    return undefined;
  }

  public async checkSessionByToken(token: string | undefined) {
    if (!token) {
      return { isLogined: false };
    }

    let response: Response;

    try {
      response = await fetch(this.iamCheckSessionUrl, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch {
      return { isLogined: false };
    }

    const raw = await response.text();

    if (!response.ok) {
      return { isLogined: false };
    }

    if (!raw) {
      return { isLogined: false };
    }

    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return { isLogined: false };
    }
  }

  public async checkSession(headers: SessionHeaders) {
    const resolvedToken = this.resolveToken(headers);
    const token = resolvedToken?.token;
    return this.checkSessionByToken(token);
  }

  public async getCurrentUser(headers: SessionHeaders) {
    const session = await this.checkSession(headers);

    if (!session || typeof session !== "object") {
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

    const user = await this.db.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        stuid: true,
        name: true,
        phoneNumber: true,
        studentId: true,
      },
      with: {
        student: {
          columns: {
            id: true,
            stuid: true,
            name: true,
            grade: true,
            class: true,
            num: true,
            point: true,
          },
        },
      },
    });

    return { ...sessionData, isLogined: true, user: user ?? null };
  }
}
