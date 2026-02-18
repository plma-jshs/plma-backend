import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AccountCreateDto, AccountUpdateDto } from './dto/accounts.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(body: AccountCreateDto) {
    return this.prisma.user.create({
      data: body,
      include: { student: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { student: true },
      orderBy: { id: 'desc' },
    });
  }

  update(id: number, body: AccountUpdateDto) {
    return this.prisma.user.update({
      where: { id },
      data: body,
      include: { student: true },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}