import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { DbService } from "../src/db/db.service";
import { SessionService } from "../src/modules/session/session.service";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  const sessionServiceMock = {
    getCurrentUser: jest.fn(),
    checkSession: jest.fn(),
  };

  const dbMock = {
    db: {
      query: {
        users: { findFirst: jest.fn(), findMany: jest.fn() },
        students: { findFirst: jest.fn(), findMany: jest.fn() },
        reasons: { findFirst: jest.fn(), findMany: jest.fn() },
        songs: { findFirst: jest.fn(), findMany: jest.fn() },
        cases: { findFirst: jest.fn(), findMany: jest.fn() },
        caseSchedules: { findFirst: jest.fn(), findMany: jest.fn() },
      },
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      transaction: jest.fn(),
    },
  } as unknown as DbService;

  beforeEach(async () => {
    sessionServiceMock.getCurrentUser.mockReset();
    sessionServiceMock.checkSession.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DbService)
      .useValue(dbMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });

  it("/points (GET) returns 401 when unauthenticated", () => {
    sessionServiceMock.getCurrentUser.mockResolvedValue({
      isLogined: false,
      user: null,
    });

    return request(app.getHttpServer()).get("/points").expect(401);
  });

  it("/points (GET) returns 403 when authenticated but permission is missing", () => {
    sessionServiceMock.getCurrentUser.mockResolvedValue({
      isLogined: true,
      user: {
        id: 1,
        stuid: 2301,
        name: "테스트 사용자",
        phoneNumber: null,
        studentId: null,
        student: null,
      },
    });
    sessionServiceMock.checkSession.mockResolvedValue({
      isLogined: true,
      permissions: ["applyAccess"],
    });

    return request(app.getHttpServer())
      .get("/points")
      .set("Authorization", "Bearer test-token")
      .expect(403);
  });

  it("/cases (GET) returns 401 when unauthenticated", () => {
    sessionServiceMock.getCurrentUser.mockResolvedValue({
      isLogined: false,
      user: null,
    });

    return request(app.getHttpServer()).get("/cases").expect(401);
  });

  it("/cases (GET) returns 403 when authenticated but permission is missing", () => {
    sessionServiceMock.getCurrentUser.mockResolvedValue({
      isLogined: true,
      user: {
        id: 1,
        stuid: 2301,
        name: "테스트 사용자",
        phoneNumber: null,
        studentId: null,
        student: null,
      },
    });
    sessionServiceMock.checkSession.mockResolvedValue({
      isLogined: true,
      permissions: ["applyAccess"],
    });

    return request(app.getHttpServer())
      .get("/cases")
      .set("Authorization", "Bearer test-token")
      .expect(403);
  });
});
