import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  getCurrentUser() {
    return this.prisma.user.findFirst({
      include: { student: true },
      orderBy: { id: 'asc' },
    });
  }
}