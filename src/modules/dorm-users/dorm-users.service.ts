import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDormUserDto } from './dto/create-dorm-user.dto';
import { UpdateDormUserDto } from './dto/update-dorm-user.dto';

@Injectable()
export class DormUsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDormUserDto: CreateDormUserDto) {
    return this.prisma.dormUser.create({
      data: createDormUserDto,
      include: { room: true, user: true },
    });
  }

  findAll() {
    return this.prisma.dormUser.findMany({
      include: { room: true, user: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.dormUser.findUnique({
      where: { id },
      include: { room: true, user: true },
    });
  }

  update(id: number, updateDormUserDto: UpdateDormUserDto) {
    return this.prisma.dormUser.update({
      where: { id },
      data: updateDormUserDto,
      include: { room: true, user: true },
    });
  }

  remove(id: number) {
    return this.prisma.dormUser.delete({ where: { id } });
  }
}