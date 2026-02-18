import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DormRoomCreateDto } from './dto/dorm-rooms.dto';

@Injectable()
export class DormRoomsService {
  constructor(private readonly prisma: PrismaService) {}

  create(body: DormRoomCreateDto) {
    return this.prisma.dormRoom.create({ data: body });
  }

  findAll() {
    return this.prisma.dormRoom.findMany({
      include: { dormUsers: true, dormReport: true },
      orderBy: { id: 'asc' },
    });
  }

  replaceAll(dormRooms: DormRoomCreateDto[]) {
    return this.prisma.$transaction(
      dormRooms.map((item) =>
        this.prisma.dormRoom.upsert({
          where: { name: item.name },
          create: item,
          update: {
            capacity: item.capacity,
            grade: item.grade,
            dormName: item.dormName,
          },
        }),
      ),
    );
  }
}