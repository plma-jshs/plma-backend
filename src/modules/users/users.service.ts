import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AccountCreateDto, AccountUpdateDto } from './dto/accounts.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly accountSelect = {
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

  create(body: AccountCreateDto) {
    return this.prisma.user.create({
      data: body,
      select: this.accountSelect,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: this.accountSelect,
      orderBy: { id: 'desc' },
    });
  }

  update(id: number, body: AccountUpdateDto) {
    return this.prisma.user.update({
      where: { id },
      data: body,
      select: this.accountSelect,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } }).then(() => undefined);
  }
}