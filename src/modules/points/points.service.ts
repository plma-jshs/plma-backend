import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  PointCreateDto,
  PointListQueryDto,
  PointReasonDto,
  PointReasonUpdateDto,
  PointStudentsQueryDto,
  PointUpdateDto,
} from './dto/points.dto';

@Injectable()
export class PointsService {
  private readonly pageSize = 20;

  constructor(private readonly prisma: PrismaService) {}

  async create(body: PointCreateDto) {
    // TODO(auth): 로그인 연동 후 실제 요청 사용자 ID로 교체해야 함
    const teacherId = 1;

    const point = await this.prisma.point.create({
      data: {
        studentId: body.studentId,
        teacherId,
        reasonId: body.reasonId,
        baseDate: new Date(),
      },
      include: { student: true, teacher: true, reason: true },
    });

    return { point };
  }

  async findAll(query: PointListQueryDto) {
    const page = Number(query.page) || 1;
    const stuId = query.stuId ? Number(query.stuId) : undefined;

    if (page < 1) {
      throw new BadRequestException('page must be greater than or equal to 1');
    }

    const points = await this.prisma.point.findMany({
      where: {
        ...(stuId ? { student: { stuid: stuId } } : {}),
      },
      include: { student: true, teacher: true, reason: true },
      orderBy: { id: 'desc' },
      skip: (page - 1) * this.pageSize,
      take: this.pageSize,
    });

    return { points };
  }

  async findStudents(query: PointStudentsQueryDto) {
    const page = Number(query.page) || 1;

    if (page < 1) {
      throw new BadRequestException('page must be greater than or equal to 1');
    }

    const students = await this.prisma.student.findMany({
      where: {
        ...(query.grade ? { grade: Number(query.grade) } : {}),
        ...(query.class ? { class: Number(query.class) } : {}),
        ...(query.number ? { num: Number(query.number) } : {}),
      },
      orderBy: [{ grade: 'asc' }, { class: 'asc' }, { num: 'asc' }],
      skip: (page - 1) * this.pageSize,
      take: this.pageSize,
    });

    return { students };
  }

  findReasons() {
    return this.prisma.reason
      .findMany({ orderBy: { id: 'desc' } })
      .then((reasons) => ({ reasons }));
  }

  async createReason(body: PointReasonDto) {
    const reason = await this.prisma.reason.create({ data: body });
    return { reason };
  }

  async updateReason(id: number, body: PointReasonUpdateDto) {
    const reason = await this.prisma.reason.update({ where: { id }, data: body });
    return { reason };
  }

  async removeReason(id: number) {
    await this.prisma.reason.delete({ where: { id } });
    return { deleted: true };
  }

  async update(id: number, body: PointUpdateDto) {
    const point = await this.prisma.point.update({
      where: { id },
      data: {
        ...(body.reasonId ? { reasonId: body.reasonId } : {}),
      },
      include: { student: true, teacher: true, reason: true },
    });

    return { point };
  }

  async remove(id: number) {
    await this.prisma.point.delete({ where: { id } });
    return { deleted: true };
  }
}