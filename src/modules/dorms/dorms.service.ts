import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  DormAssignmentsQuery,
  DormAssignmentsUpsertInput,
  DormReportCreateInput,
  DormReportUpdateInput,
} from './dto/dorms.schema';

@Injectable()
export class DormRoomsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly reportInclude = {
    user: {
      select: {
        id: true,
        stuid: true,
        name: true,
      },
    },
    room: {
      select: {
        id: true,
        name: true,
        dormName: true,
      },
    },
  } as const;

  async findAssignments(query: DormAssignmentsQuery) {
    const rooms = await this.prisma.dormRoom.findMany({
      orderBy: { id: 'asc' },
      include: {
        dormUsers: {
          where: {
            year: query.year,
            semester: query.semester,
          },
          orderBy: { bedPosition: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                stuid: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      year: query.year,
      semester: query.semester,
      rooms: rooms.map((room) => ({
        roomId: room.id,
        room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          grade: room.grade,
          dormName: room.dormName,
        },
        members: room.dormUsers.map((member) => ({
          userId: member.userId,
          bedPosition: member.bedPosition,
          user: member.user,
        })),
      })),
    };
  }

  async upsertAssignments(body: DormAssignmentsUpsertInput) {
    const roomIds = body.rooms.map((item) => item.roomId);
    const uniqueRoomIds = new Set(roomIds);

    if (uniqueRoomIds.size !== roomIds.length) {
      throw new BadRequestException('rooms contains duplicate roomId');
    }

    const allMembers = body.rooms.flatMap((room) => room.members.map((member) => ({
      roomId: room.roomId,
      userId: member.userId,
      bedPosition: member.bedPosition,
    })));

    const uniqueUserIds = new Set(allMembers.map((item) => item.userId));
    if (uniqueUserIds.size !== allMembers.length) {
      throw new BadRequestException('a user can only be assigned to one room per semester');
    }

    const roomMap = new Map(body.rooms.map((room) => [room.roomId, room.members]));

    const rooms = await this.prisma.dormRoom.findMany({
      where: { id: { in: [...uniqueRoomIds] } },
      select: { id: true, capacity: true },
    });

    if (rooms.length !== uniqueRoomIds.size) {
      throw new NotFoundException('one or more roomId does not exist');
    }

    for (const room of rooms) {
      const members = roomMap.get(room.id) ?? [];
      if (members.length > room.capacity) {
        throw new BadRequestException(`roomId ${room.id} exceeds room capacity`);
      }

      const bedSet = new Set<number>();
      for (const member of members) {
        if (member.bedPosition > room.capacity) {
          throw new BadRequestException(`roomId ${room.id} bedPosition exceeds room capacity`);
        }
        if (bedSet.has(member.bedPosition)) {
          throw new BadRequestException(`roomId ${room.id} has duplicate bedPosition`);
        }
        bedSet.add(member.bedPosition);
      }
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: [...uniqueUserIds] } },
      select: { id: true },
    });

    if (users.length !== uniqueUserIds.size) {
      throw new NotFoundException('one or more userId does not exist');
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.dormUser.deleteMany({
        where: {
          year: body.year,
          semester: body.semester,
        },
      });

      if (allMembers.length > 0) {
        await transaction.dormUser.createMany({
          data: allMembers.map((item) => ({
            roomId: item.roomId,
            userId: item.userId,
            year: body.year,
            semester: body.semester,
            bedPosition: item.bedPosition,
          })),
        });
      }
    });

    return {
      year: body.year,
      semester: body.semester,
      roomCount: body.rooms.length,
      assignedUserCount: allMembers.length,
    };
  }

  createReport(body: DormReportCreateInput) {
    return this.prisma.dormReport.create({
      data: body,
      include: this.reportInclude,
    });
  }

  findReports() {
    return this.prisma.dormReport.findMany({
      include: this.reportInclude,
      orderBy: { id: 'desc' },
    });
  }

  updateReport(id: number, body: DormReportUpdateInput) {
    return this.prisma.dormReport.update({
      where: { id },
      data: body,
      include: this.reportInclude,
    });
  }

  async removeReport(id: number) {
    await this.prisma.dormReport.delete({ where: { id } });
  }
}