import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateCaseDto } from './dto/update-case.dto';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.case.findMany({ orderBy: { id: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.case.findUnique({ where: { id } });
  }

  update(id: number, updateCaseDto: UpdateCaseDto) {
    return this.prisma.case.update({
      where: { id },
      data: updateCaseDto,
    });
  }

  async replaceAll(body: UpdateCaseDto) {
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
}