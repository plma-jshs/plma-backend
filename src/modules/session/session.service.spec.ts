import { SessionService } from "./session.service";
import { DbService } from "@/db/db.service";
import { extractSessionHeaders } from "@/common/http/session-headers";

describe("SessionService", () => {
  const originalIamCheckSessionUrl = process.env.IAM_CHECK_SESSION_URL;
  const userFindFirstMock = jest.fn();

  const dbService = {
    db: {
      query: {
        users: {
          findFirst: userFindFirstMock,
        },
      },
    },
  } as unknown as DbService;

  let service: SessionService;

  beforeAll(() => {
    process.env.IAM_CHECK_SESSION_URL = "https://iam.jshsus.kr/check-session";
  });

  beforeEach(() => {
    userFindFirstMock.mockReset();
    service = new SessionService(dbService);
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env.IAM_CHECK_SESSION_URL = originalIamCheckSessionUrl;
  });

  describe("checkSession", () => {
    it("returns not logged in when authorization and iam_token cookie are both missing", async () => {
      await expect(service.checkSession({})).resolves.toEqual({
        isLogined: false,
      });
    });

    it("returns not logged in when authorization header format is invalid", async () => {
      await expect(
        service.checkSession({ authorization: "Token abc" }),
      ).resolves.toEqual({
        isLogined: false,
      });
    });

    it("forwards bearer token to IAM upstream", async () => {
      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ isLogined: true, iamId: 1 }),
      } as Response);

      const result = await service.checkSession({
        authorization: "Bearer token-a",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://iam.jshsus.kr/check-session",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({ authorization: "Bearer token-a" }),
        }),
      );
      expect(result).toEqual({ isLogined: true, iamId: 1 });
    });

    it("uses iam_token cookie when authorization is missing", async () => {
      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ isLogined: true }),
      } as Response);

      const result = await service.checkSession({
        cookie: "foo=bar; iam_token=token-b; hello=world",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://iam.jshsus.kr/check-session",
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: "Bearer token-b" }),
        }),
      );
      expect(result).toEqual({ isLogined: true });
    });

    it("uses cookie token when authorization header is array via extractSessionHeaders", async () => {
      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ isLogined: true }),
      } as Response);

      const headers = extractSessionHeaders({
        authorization: ["Bearer ignored-array"],
        cookie: "foo=bar; iam_token=token-from-cookie",
      } as unknown as import("http").IncomingHttpHeaders);

      const result = await service.checkSession(headers);

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://iam.jshsus.kr/check-session",
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: "Bearer token-from-cookie",
          }),
        }),
      );
      expect(result).toEqual({ isLogined: true });
    });

    it("returns not logged in when authorization and cookie are both arrays via extractSessionHeaders", async () => {
      const headers = extractSessionHeaders({
        authorization: ["Bearer ignored-array"],
        cookie: ["iam_token=token-array"],
      } as unknown as import("http").IncomingHttpHeaders);

      await expect(service.checkSession(headers)).resolves.toEqual({
        isLogined: false,
      });
    });

    it("returns not logged in when iam_token cookie is empty", async () => {
      await expect(
        service.checkSession({ cookie: "foo=bar; iam_token=   ; hello=world" }),
      ).resolves.toEqual({
        isLogined: false,
      });
    });

    it("returns not logged in when IAM responds with non-401 error", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "upstream error",
      } as Response);

      await expect(
        service.checkSession({ authorization: "Bearer token-c" }),
      ).resolves.toEqual({
        isLogined: false,
      });
    });
  });

  describe("getCurrentUser", () => {
    it("returns isLogined false when checkSession says not logged in", async () => {
      jest
        .spyOn(service, "checkSession")
        .mockResolvedValue({ isLogined: false });

      const result = await service.getCurrentUser({
        authorization: "Bearer token-a",
      });

      expect(result).toEqual({ isLogined: false, user: null });
      expect(userFindFirstMock).not.toHaveBeenCalled();
    });

    it("returns merged session and local user when userId is valid", async () => {
      jest
        .spyOn(service, "checkSession")
        .mockResolvedValue({ isLogined: true, iamId: 1, userId: 7 });
      userFindFirstMock.mockResolvedValue({
        id: 7,
        stuid: 2301,
        name: "홍길동",
      });

      const result = await service.getCurrentUser({
        authorization: "Bearer token-a",
      });

      expect(userFindFirstMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        isLogined: true,
        iamId: 1,
        userId: 7,
        user: { id: 7, stuid: 2301, name: "홍길동" },
      });
    });
  });
});
