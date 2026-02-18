import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AccountCreateInput,
  AccountListQuery,
  AccountUpdateInput,
} from './dto/accounts.schema';

@Injectable()
export class AccountsService {
  private readonly pageSize = 20;

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
      },
    },
  } as const;

  create(body: AccountCreateInput) {
    return this.prisma.user.create({
      data: body,
      select: this.accountSelect,
    });
  }

  findAll(query: AccountListQuery) {
    const page = Number(query.page) || 1;

    return this.prisma.user.findMany({
      select: this.accountSelect,
      orderBy: { id: 'desc' },
      skip: (page - 1) * this.pageSize,
      take: this.pageSize,
    });
  }

  update(id: number, body: AccountUpdateInput) {
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