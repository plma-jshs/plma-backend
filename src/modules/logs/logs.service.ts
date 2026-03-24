import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logPointStudentSelect = {
    id: true,
    stuid: true,
    name: true,
  } as const;

  private readonly logPointTeacherSelect = {
    id: true,
    stuid: true,
    name: true,
  } as const;

  private readonly logAccountSelect = {
    id: true,
    stuid: true,
    name: true,
    studentId: true,
  } as const;

  private readonly logDormSelect = {
    id: true,
    name: true,
    grade: true,
    dormName: true,
    _count: {
      select: {
        dormUsers: true,
        dormReport: true,
      },
    },
  } as const;

  getPointLogs() {
    return this.prisma.point.findMany({
      select: {
        id: true,
        studentId: true,
        teacherId: true,
        reasonId: true,
        point: true,
        comment: true,
        baseDate: true,
        updatedAt: true,
        student: { select: this.logPointStudentSelect },
        teacher: { select: this.logPointTeacherSelect },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  getSongLogs() {
    return this.prisma.song.findMany({
      orderBy: { id: 'desc' },
      take: 100,
    });
  }

  getDormLogs() {
    return this.prisma.dormRoom.findMany({
      select: this.logDormSelect,
      orderBy: { id: 'desc' },
      take: 100,
    });
  }

  getAccountLogs() {
    return this.prisma.user.findMany({
      select: this.logAccountSelect,
      orderBy: { id: 'desc' },
      take: 100,
    });
  }

  getRemoteLogs() {
    return this.prisma.case.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }
}