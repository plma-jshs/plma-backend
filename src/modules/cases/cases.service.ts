import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CaseScheduleCreateInput, CaseScheduleUpdateInput, CaseUpdateInput } from './dto/cases.schema';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.case.findMany({ orderBy: { id: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.case.findUnique({ where: { id } });
  }

  update(id: number, updateCaseInput: CaseUpdateInput) {
    return this.prisma.case.update({
      where: { id },
      data: updateCaseInput,
    });
  }

  async updateAll(body: CaseUpdateInput) {
    if (body.isOpen === undefined) {
      throw new BadRequestException('isOpen is required for updateAll');
    }

    const targetIsOpen = body.isOpen;

    const [totalCases, disconnectedCases, updated] = await this.prisma.$transaction([
      this.prisma.case.count(),
      this.prisma.case.count({ where: { isConnected: false } }),
      this.prisma.case.updateMany({
        where: { isConnected: true },
        data: { isOpen: targetIsOpen },
      }),
    ]);

    return {
      targetIsOpen,
      totalCases,
      excludedDisconnectedCount: disconnectedCases,
      updatedCount: updated.count,
    };
  }

  createSchedule(body: CaseScheduleCreateInput) {
    return this.prisma.caseSchedule.create({
      data: {
        date: new Date(body.date),
        isOpen: body.isOpen,
      },
    });
  }

  findSchedules() {
    return this.prisma.caseSchedule.findMany({ orderBy: { date: 'asc' } });
  }

  updateSchedule(id: number, body: CaseScheduleUpdateInput) {
    const { date, ...rest } = body;

    return this.prisma.caseSchedule.update({
      where: { id },
      data: {
        ...rest,
        ...(date ? { date: new Date(date) } : {}),
      },
    });
  }

  async removeSchedule(id: number) {
    return this.prisma.caseSchedule.delete({ where: { id } }).then(() => undefined);
  }
}