import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDormReportDto } from './dto/create-dorm-report.dto';
import { UpdateDormReportDto } from './dto/update-dorm-report.dto';

@Injectable()
export class DormReportsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDormReportDto: CreateDormReportDto) {
    return this.prisma.dormReport.create({
      data: createDormReportDto,
      include: { user: true, room: true },
    });
  }

  findAll() {
    return this.prisma.dormReport.findMany({
      include: { user: true, room: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.dormReport.findUnique({
      where: { id },
      include: { user: true, room: true },
    });
  }

  update(id: number, updateDormReportDto: UpdateDormReportDto) {
    return this.prisma.dormReport.update({
      where: { id },
      data: updateDormReportDto,
      include: { user: true, room: true },
    });
  }

  remove(id: number) {
    return this.prisma.dormReport.delete({ where: { id } });
  }
}