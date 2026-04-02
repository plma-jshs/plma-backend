import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import { students, users } from "@/db/schema";
import { SessionHeaders } from "@/common/http/session-headers";

@Injectable()
export class SessionService {
  private readonly isDevelopment = process.env.NODE_ENV === "development";

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

  private getDevelopmentMockSession() {
    return {
      isLogined: true,
      iamId: 999999,
      userId: 1,
      plmaId: 1,
      stuid: 900001,
      name: "Dev Mock User",
      jshsus: true,
      permissions: [
        "viewAll",
        "applyAccess",
        "viewPointsLogs",
        "viewRemoteCaseHistory",
      ],
    };
  }

  private normalizeSessionPayload(raw: unknown) {
    if (!raw || typeof raw !== "object") {
      return { isLogined: false as const };
    }

    const source = raw as Record<string, unknown>;

    const toIntOrUndefined = (value: unknown) => {
      if (value === null) {
        return null;
      }

      const num = Number(value);
      if (!Number.isInteger(num)) {
        return undefined;
      }

      return num;
    };

    const toBooleanOrUndefined = (value: unknown) => {
      if (value === null) {
        return null;
      }

      if (typeof value === "boolean") {
        return value;
      }

      if (value === 1 || value === "1") {
        return true;
      }

      if (value === 0 || value === "0") {
        return false;
      }

      return undefined;
    };

    const normalized: Record<string, unknown> = {
      isLogined: source.isLogined === true,
    };

    const iamId = toIntOrUndefined(source.iamId);
    const userId = toIntOrUndefined(source.userId);
    const plmaId = toIntOrUndefined(source.plmaId);
    const stuid = toIntOrUndefined(source.stuid);
    const jshsus = toBooleanOrUndefined(source.jshsus);

    if (iamId !== undefined) normalized.iamId = iamId;
    if (userId !== undefined) normalized.userId = userId;
    if (plmaId !== undefined) normalized.plmaId = plmaId;
    if (stuid !== undefined) normalized.stuid = stuid;
    if (jshsus !== undefined) normalized.jshsus = jshsus;

    if (typeof source.name === "string") {
      normalized.name = source.name;
    } else if (source.name === null) {
      normalized.name = null;
    }

    if (Array.isArray(source.permissions)) {
      normalized.permissions = source.permissions.filter(
        (permission): permission is string => typeof permission === "string",
      );
    }

    return normalized;
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
      return this.normalizeSessionPayload(JSON.parse(raw) as unknown);
    } catch {
      return { isLogined: false };
    }
  }

  public async checkSession(headers: SessionHeaders) {
    if (this.isDevelopment) {
      return this.getDevelopmentMockSession();
    }

    const resolvedToken = this.resolveToken(headers);
    const token = resolvedToken?.token;
    return this.checkSessionByToken(token);
  }

  public async syncUserFromSession(session: unknown) {
    if (!session || typeof session !== "object") {
      return null;
    }

    const sessionData = session as Record<string, unknown>;
    if (sessionData.isLogined !== true) {
      return null;
    }

    const userId = Number(sessionData.userId);
    const stuid = Number(sessionData.stuid);
    const name =
      typeof sessionData.name === "string" && sessionData.name.trim().length > 0
        ? sessionData.name.trim()
        : null;

    if (
      !Number.isInteger(userId) ||
      userId < 1 ||
      !Number.isInteger(stuid) ||
      stuid < 1 ||
      !name
    ) {
      return null;
    }

    const existingById = await this.db.db.query.users.findFirst({
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
    if (existingById) {
      return existingById;
    }

    const existingByStuid = await this.db.db.query.users.findFirst({
      where: eq(users.stuid, stuid),
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
    if (existingByStuid) {
      return existingByStuid;
    }

    const matchedStudent = await this.db.db.query.students.findFirst({
      where: eq(students.stuid, stuid),
      columns: { id: true },
    });

    try {
      await this.db.db.insert(users).values({
        id: userId,
        stuid,
        name,
        password: "IAM_SYNC_ACCOUNT",
        studentId: matchedStudent?.id,
        phoneNumber: null,
      });
    } catch {
      // concurrent sync requests may already have inserted the same user
    }

    return this.db.db.query.users.findFirst({
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
