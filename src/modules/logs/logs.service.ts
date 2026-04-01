import { Injectable } from "@nestjs/common";
import { desc, eq, sql } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import {
  cases,
  dormReports,
  dormRooms,
  dormUsers,
  points,
  songs,
  students,
  users,
} from "@/db/schema";

//TODO: 로그 기록하기

@Injectable()
export class LogsService {
  constructor(private readonly db: DbService) {}

  getPointLogs() {
    return this.db.db
      .select({
        id: points.id,
        studentId: points.studentId,
        teacherId: points.teacherId,
        reasonId: points.reasonId,
        point: points.point,
        comment: points.comment,
        baseDate: points.baseDate,
        updatedAt: points.updatedAt,
        student: {
          id: students.id,
          stuid: students.stuid,
          name: students.name,
        },
        teacher: {
          id: users.id,
          stuid: users.stuid,
          name: users.name,
        },
      })
      .from(points)
      .innerJoin(students, eq(points.studentId, students.id))
      .innerJoin(users, eq(points.teacherId, users.id))
      .orderBy(desc(points.updatedAt))
      .limit(100);
  }

  getSongLogs() {
    return this.db.db.select().from(songs).orderBy(desc(songs.id)).limit(100);
  }

  async getDormLogs() {
    const roomUserCounts = this.db.db
      .select({
        roomId: dormUsers.roomId,
        count: sql<number>`count(*)`,
      })
      .from(dormUsers)
      .groupBy(dormUsers.roomId)
      .as("room_user_counts");

    const roomReportCounts = this.db.db
      .select({
        roomId: dormReports.roomId,
        count: sql<number>`count(*)`,
      })
      .from(dormReports)
      .groupBy(dormReports.roomId)
      .as("room_report_counts");

    const rows = await this.db.db
      .select({
        id: dormRooms.id,
        name: dormRooms.name,
        grade: dormRooms.grade,
        dormName: dormRooms.dormName,
        dormUsersCount: roomUserCounts.count,
        dormReportCount: roomReportCounts.count,
      })
      .from(dormRooms)
      .leftJoin(roomUserCounts, eq(dormRooms.id, roomUserCounts.roomId))
      .leftJoin(roomReportCounts, eq(dormRooms.id, roomReportCounts.roomId))
      .orderBy(desc(dormRooms.id))
      .limit(100);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      grade: row.grade,
      dormName: row.dormName,
      _count: {
        dormUsers: Number(row.dormUsersCount ?? 0),
        dormReport: Number(row.dormReportCount ?? 0),
      },
    }));
  }

  getAccountLogs() {
    return this.db.db
      .select({
        id: users.id,
        stuid: users.stuid,
        name: users.name,
        studentId: users.studentId,
      })
      .from(users)
      .orderBy(desc(users.id))
      .limit(100);
  }

  getRemoteLogs() {
    return this.db.db
      .select()
      .from(cases)
      .orderBy(desc(cases.updatedAt))
      .limit(100);
  }
}
