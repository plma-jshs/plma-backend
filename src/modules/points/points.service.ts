import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  PointCreateInput,
  PointListQuery,
  PointReasonCreateInput,
  PointReasonUpdateInput,
  PointStudentsQuery,
  PointUpdateInput,
} from './dto/points.schema';

@Injectable()
export class PointsService {
  private readonly pageSize = 20;
  private readonly pointStudentBriefSelect = {
    id: true,
    stuid: true,
    name: true,
  } as const;
  private readonly pointStudentSelect = {
    id: true,
    stuid: true,
    name: true,
    grade: true,
    class: true,
    num: true,
    point: true,
  } as const;
  private readonly pointTeacherSelect = {
    id: true,
    stuid: true,
    name: true,
  } as const;
  private readonly pointInclude = {
    student: {
      select: this.pointStudentBriefSelect,
    },
    teacher: {
      select: this.pointTeacherSelect,
    },
  } as const;
  private readonly pointIncludeWithoutStudent = {
    teacher: {
      select: this.pointTeacherSelect,
    },
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  async create(body: PointCreateInput) {
    // TODO(auth): 로그인 연동 후 실제 요청 사용자 ID로 교체해야 함
    const teacherId = 1;

    const point = await this.prisma.point.create({
      data: {
        studentId: body.studentId,
        teacherId,
        reasonId: body.reasonId,
        point: body.point,
        comment: body.comment,
        baseDate: new Date(),
      },
      include: this.pointInclude,
    });

    return { point };
  }

  async findAll(query: PointListQuery) {
    const page = Number(query.page) || 1;
    const stuId = query.stuId ? Number(query.stuId) : undefined;

    if (page < 1) {
      throw new BadRequestException('page must be greater than or equal to 1');
    }

    const points = await this.prisma.point.findMany({
      where: {
        ...(stuId ? { student: { stuid: stuId } } : {}),
      },
      include: this.pointInclude,
      orderBy: { id: 'desc' },
      skip: (page - 1) * this.pageSize,
      take: this.pageSize,
    });

    return { points };
  }

  async findStudents(query: PointStudentsQuery) {
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

  async findStudentById(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: this.pointStudentSelect,
    });

    if (!student) {
      throw new NotFoundException('student not found');
    }

    const points = await this.prisma.point.findMany({
      where: { studentId },
      include: this.pointIncludeWithoutStudent,
      orderBy: { id: 'desc' },
    });

    return { student, points };
  }

  findReasons() {
    return this.prisma.reason
      .findMany({ orderBy: { id: 'desc' } })
      .then((reasons) => ({ reasons }));
  }

  async createReason(body: PointReasonCreateInput) {
    const reason = await this.prisma.reason.create({ data: body });
    return { reason };
  }

  async updateReason(id: number, body: PointReasonUpdateInput) {
    const reason = await this.prisma.reason.update({ where: { id }, data: body });
    return { reason };
  }

  async removeReason(id: number) {
    await this.prisma.reason.delete({ where: { id } });
  }

  async update(id: number, body: PointUpdateInput) {
    const data: {
      reasonId?: number;
      point?: number;
      comment?: string;
    } = {};

    if (body.reasonId !== undefined) {
      data.reasonId = body.reasonId;
    }

    if (body.point !== undefined) {
      data.point = body.point;
    }

    if (body.comment !== undefined) {
      data.comment = body.comment;
    }

    const point = await this.prisma.point.update({
      where: { id },
      data,
      include: this.pointInclude,
    });

    return { point };
  }

  async remove(id: number) {
    await this.prisma.point.delete({ where: { id } });
  }
}