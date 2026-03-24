import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const prismaMock = {
    user: { findFirst: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    point: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    reason: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    case: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn(), count: jest.fn() },
    caseSchedule: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
    dormRoom: { findMany: jest.fn() },
    dormUser: { deleteMany: jest.fn(), createMany: jest.fn() },
    dormReport: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
    song: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
    $transaction: jest.fn(),
    $connect: jest.fn(),
  } as unknown as PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
