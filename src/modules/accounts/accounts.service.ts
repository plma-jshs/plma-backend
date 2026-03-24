import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AccountCreateInput,
  AccountListQuery,
  AccountUpdateInput,
} from './dto/accounts.schema';

const scrypt = promisify(scryptCallback);

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

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, 64) as Buffer;
    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
  }

  async create(body: AccountCreateInput) {
    const password = await this.hashPassword(body.password);

    return this.prisma.user.create({
      data: {
        ...body,
        password,
      },
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

  async update(id: number, body: AccountUpdateInput) {
    const data = { ...body };

    if (body.password !== undefined) {
      data.password = await this.hashPassword(body.password);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.accountSelect,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } }).then(() => undefined);
  }
}