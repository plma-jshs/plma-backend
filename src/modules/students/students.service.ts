import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({ data: createStudentDto });
  }

  findAll() {
    return this.prisma.student.findMany({
      include: { user: true, points: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { user: true, points: true },
    });
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
    });
  }

  remove(id: number) {
    return this.prisma.student.delete({ where: { id } });
  }
}