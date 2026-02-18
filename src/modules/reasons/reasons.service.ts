import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';

@Injectable()
export class ReasonsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReasonDto: CreateReasonDto) {
    return this.prisma.reason.create({ data: createReasonDto });
  }

  findAll() {
    return this.prisma.reason.findMany({ orderBy: { id: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.reason.findUnique({ where: { id } });
  }

  update(id: number, updateReasonDto: UpdateReasonDto) {
    return this.prisma.reason.update({ where: { id }, data: updateReasonDto });
  }

  remove(id: number) {
    return this.prisma.reason.delete({ where: { id } });
  }
}