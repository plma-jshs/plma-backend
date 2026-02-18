import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CaseScheduleCreateDto,
  CaseScheduleUpdateDto,
} from './dto/case-schedules.dto';

@Injectable()
export class CaseSchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  create(body: CaseScheduleCreateDto) {
    return this.prisma.caseSchedule.create({
      data: {
        ...body,
        date: new Date(body.date),
      },
    });
  }

  findAll() {
    return this.prisma.caseSchedule.findMany({ orderBy: { date: 'asc' } });
  }

  update(id: number, body: CaseScheduleUpdateDto) {
    const { date, ...rest } = body;

    return this.prisma.caseSchedule.update({
      where: { id },
      data: {
        ...rest,
        ...(date ? { date: new Date(date) } : {}),
      },
    });
  }

  remove(id: number) {
    return this.prisma.caseSchedule.delete({ where: { id } }).then(() => undefined);
  }
}