import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  getCurrentUser() {
    return this.prisma.user.findFirst({
      select: {
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
      },
      orderBy: { id: 'asc' },
    });
  }
}