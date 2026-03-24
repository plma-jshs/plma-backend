import { BadGatewayException, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('SessionService', () => {
  const userFindUniqueMock = jest.fn();

  const prisma = {
    user: {
      findUnique: userFindUniqueMock,
    },
  } as unknown as PrismaService;

  let service: SessionService;

  beforeEach(() => {
    userFindUniqueMock.mockReset();
    service = new SessionService(prisma);
    jest.restoreAllMocks();
  });

  describe('checkSession', () => {
    it('throws when authorization and iam_token cookie are both missing', async () => {
      await expect(service.checkSession({})).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws when authorization header format is invalid', async () => {
      await expect(
        service.checkSession({ authorization: 'Token abc' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('forwards bearer token to IAM upstream', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ isLogined: true, iamId: 1 }),
      } as Response);

      const result = await service.checkSession({ authorization: 'Bearer token-a' });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://iam.jshsus.kr/check-session',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({ authorization: 'Bearer token-a' }),
        }),
      );
      expect(result).toEqual({ isLogined: true, iamId: 1 });
    });

    it('uses iam_token cookie when authorization is missing', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ isLogined: true }),
      } as Response);

      const result = await service.checkSession({
        cookie: 'foo=bar; iam_token=token-b; hello=world',
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://iam.jshsus.kr/check-session',
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: 'Bearer token-b' }),
        }),
      );
      expect(result).toEqual({ isLogined: true });
    });

    it('throws bad gateway when IAM responds with non-401 error', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'upstream error',
      } as Response);

      await expect(
        service.checkSession({ authorization: 'Bearer token-c' }),
      ).rejects.toBeInstanceOf(BadGatewayException);
    });
  });

  describe('getCurrentUser', () => {
    it('returns isLogined false when checkSession says not logged in', async () => {
      jest.spyOn(service, 'checkSession').mockResolvedValue({ isLogined: false });

      const result = await service.getCurrentUser({ authorization: 'Bearer token-a' });

      expect(result).toEqual({ isLogined: false, user: null });
      expect(userFindUniqueMock).not.toHaveBeenCalled();
    });

    it('returns merged session and local user when userId is valid', async () => {
      jest
        .spyOn(service, 'checkSession')
        .mockResolvedValue({ isLogined: true, iamId: 1, userId: 7 });
      userFindUniqueMock.mockResolvedValue({ id: 7, stuid: 2301, name: '홍길동' });

      const result = await service.getCurrentUser({ authorization: 'Bearer token-a' });

      expect(userFindUniqueMock).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 7 } }),
      );
      expect(result).toEqual({
        isLogined: true,
        iamId: 1,
        userId: 7,
        user: { id: 7, stuid: 2301, name: '홍길동' },
      });
    });
  });
});
