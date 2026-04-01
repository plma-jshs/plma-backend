import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import { dormReports, dormRooms, dormUsers, users } from "@/db/schema";
import { ensureFound } from "@/common/db/ensure-found";
import {
  DormAssignmentsQueryDto,
  DormAssignmentsUpsertDto,
  DormReportCreateDto,
  DormReportsQueryDto,
  DormReportUpdateDto,
} from "./dto/dorms.schema";

@Injectable()
export class DormRoomsService {
  constructor(private readonly db: DbService) {}

  async findAssignments(query: DormAssignmentsQueryDto) {
    const rooms = await this.db.db
      .select()
      .from(dormRooms)
      .orderBy(asc(dormRooms.id));
    const members = await this.db.db
      .select({
        roomId: dormUsers.roomId,
        userId: dormUsers.userId,
        bedPosition: dormUsers.bedPosition,
        user: {
          id: users.id,
          stuid: users.stuid,
          name: users.name,
        },
      })
      .from(dormUsers)
      .innerJoin(users, eq(dormUsers.userId, users.id))
      .where(
        and(
          eq(dormUsers.year, query.year),
          eq(dormUsers.semester, query.semester),
        ),
      )
      .orderBy(asc(dormUsers.roomId), asc(dormUsers.bedPosition));

    const memberMap = new Map<
      number,
      Array<{
        userId: number;
        bedPosition: number;
        user: { id: number; stuid: number; name: string };
      }>
    >();
    for (const member of members) {
      const list = memberMap.get(member.roomId) ?? [];
      list.push({
        userId: member.userId,
        bedPosition: member.bedPosition,
        user: member.user,
      });
      memberMap.set(member.roomId, list);
    }

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
        members: memberMap.get(room.id) ?? [],
      })),
    };
  }

  async upsertAssignments(body: DormAssignmentsUpsertDto) {
    const roomIds = body.rooms.map((item) => item.roomId);
    const uniqueRoomIds = new Set(roomIds);

    if (uniqueRoomIds.size !== roomIds.length) {
      throw new BadRequestException("rooms contains duplicate roomId");
    }

    const allMembers = body.rooms.flatMap((room) =>
      room.members.map((member) => ({
        roomId: room.roomId,
        userId: member.userId,
        bedPosition: member.bedPosition,
      })),
    );

    const uniqueUserIds = new Set(allMembers.map((item) => item.userId));
    if (uniqueUserIds.size !== allMembers.length) {
      throw new BadRequestException(
        "a user can only be assigned to one room per semester",
      );
    }

    const roomMap = new Map(
      body.rooms.map((room) => [room.roomId, room.members]),
    );

    const rooms =
      uniqueRoomIds.size === 0
        ? []
        : await this.db.db
            .select({ id: dormRooms.id, capacity: dormRooms.capacity })
            .from(dormRooms)
            .where(inArray(dormRooms.id, [...uniqueRoomIds]));

    if (rooms.length !== uniqueRoomIds.size) {
      throw new NotFoundException("one or more roomId does not exist");
    }

    for (const room of rooms) {
      const members = roomMap.get(room.id) ?? [];
      if (members.length > room.capacity) {
        throw new BadRequestException(
          `roomId ${room.id} exceeds room capacity`,
        );
      }

      const bedSet = new Set<number>();
      for (const member of members) {
        if (member.bedPosition > room.capacity) {
          throw new BadRequestException(
            `roomId ${room.id} bedPosition exceeds room capacity`,
          );
        }
        if (bedSet.has(member.bedPosition)) {
          throw new BadRequestException(
            `roomId ${room.id} has duplicate bedPosition`,
          );
        }
        bedSet.add(member.bedPosition);
      }
    }

    const foundUsers =
      uniqueUserIds.size === 0
        ? []
        : await this.db.db
            .select({ id: users.id })
            .from(users)
            .where(inArray(users.id, [...uniqueUserIds]));

    if (foundUsers.length !== uniqueUserIds.size) {
      throw new NotFoundException("one or more userId does not exist");
    }

    await this.db.db.transaction(async (tx) => {
      await tx
        .delete(dormUsers)
        .where(
          and(
            eq(dormUsers.year, body.year),
            eq(dormUsers.semester, body.semester),
          ),
        );

      if (allMembers.length > 0) {
        await tx.insert(dormUsers).values(
          allMembers.map((item) => ({
            roomId: item.roomId,
            userId: item.userId,
            year: body.year,
            semester: body.semester,
            bedPosition: item.bedPosition,
          })),
        );
      }
    });

    return {
      year: body.year,
      semester: body.semester,
      roomCount: body.rooms.length,
      assignedUserCount: allMembers.length,
    };
  }

  private async findReportById(id: number) {
    const rows = await this.db.db
      .select({
        report: dormReports,
        user: {
          id: users.id,
          stuid: users.stuid,
          name: users.name,
        },
        room: {
          id: dormRooms.id,
          name: dormRooms.name,
          dormName: dormRooms.dormName,
        },
      })
      .from(dormReports)
      .innerJoin(users, eq(dormReports.userId, users.id))
      .innerJoin(dormRooms, eq(dormReports.roomId, dormRooms.id))
      .where(eq(dormReports.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      ...row.report,
      user: row.user,
      room: row.room,
    };
  }

  async createReport(body: DormReportCreateDto) {
    const [created] = await this.db.db
      .insert(dormReports)
      .values(body)
      .$returningId();
    return ensureFound(
      await this.findReportById(created.id),
      "dorm report not found",
    );
  }

  async findReports(query: DormReportsQueryDto) {
    const { page, size } = query;

    const [rows, totalRows] = await Promise.all([
      this.db.db
        .select({
          report: dormReports,
          user: {
            id: users.id,
            stuid: users.stuid,
            name: users.name,
          },
          room: {
            id: dormRooms.id,
            name: dormRooms.name,
            dormName: dormRooms.dormName,
          },
        })
        .from(dormReports)
        .innerJoin(users, eq(dormReports.userId, users.id))
        .innerJoin(dormRooms, eq(dormReports.roomId, dormRooms.id))
        .orderBy(desc(dormReports.id))
        .offset((page - 1) * size)
        .limit(size),
      this.db.db.select({ total: sql<number>`count(*)` }).from(dormReports),
    ]);

    const total = Number(totalRows[0]?.total ?? 0);
    const lastPage = total === 0 ? 0 : Math.ceil(total / size);

    return {
      data: rows.map((row) => ({
        ...row.report,
        user: row.user,
        room: row.room,
      })),
      meta: {
        total,
        page,
        size,
        lastPage,
      },
    };
  }

  async updateReport(id: number, body: DormReportUpdateDto) {
    const existingReport = await this.findReportById(id);
    ensureFound(existingReport, "dorm report not found");

    await this.db.db
      .update(dormReports)
      .set(body)
      .where(eq(dormReports.id, id));
    return ensureFound(await this.findReportById(id), "dorm report not found");
  }

  async removeReport(id: number) {
    const existingReport = await this.findReportById(id);
    ensureFound(existingReport, "dorm report not found");

    await this.db.db.delete(dormReports).where(eq(dormReports.id, id));
  }
}
