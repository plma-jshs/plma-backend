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

  async replaceAll(body: CaseUpdateInput) {
    if (!body.status) {
      throw new BadRequestException('status is required for replaceAll');
    }

    if (body.status === 'DISCONNECTED') {
      throw new BadRequestException(
        'replaceAll does not allow DISCONNECTED as target status',
      );
    }

    const targetStatus = body.status;

    const [totalCases, disconnectedCases, updated] = await this.prisma.$transaction([
      this.prisma.case.count(),
      this.prisma.case.count({ where: { status: 'DISCONNECTED' } }),
      this.prisma.case.updateMany({
        where: { status: { not: 'DISCONNECTED' } },
        data: { status: targetStatus },
      }),
    ]);

    return {
      targetStatus,
      totalCases,
      excludedDisconnectedCount: disconnectedCases,
      updatedCount: updated.count,
    };
  }

  createSchedule(body: CaseScheduleCreateInput) {
    return this.prisma.caseSchedule.create({
      data: {
        ...body,
        date: new Date(body.date),
      },
    });
  }

  findAllSchedule() {
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

  removeSchedule(id: number) {
    return this.prisma.caseSchedule.delete({ where: { id } }).then(() => undefined);
  }
}