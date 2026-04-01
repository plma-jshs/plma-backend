import { Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import { points as pointsTable, reasons, students } from "@/db/schema";
import { ensureFound } from "@/common/db/ensure-found";
import {
  PointCreateDto,
  PointListQueryDto,
  PointReasonCreateDto,
  PointReasonUpdateDto,
  PointStudentsQueryDto,
  PointUpdateDto,
} from "./dto/points.schema";

@Injectable()
export class PointsService {
  private readonly pageSize = 20;
  constructor(private readonly db: DbService) {}

  private serializePointRecord<T extends { baseDate: Date; updatedAt: Date }>(
    point: T,
  ) {
    return {
      ...point,
      baseDate: point.baseDate.toISOString(),
      updatedAt: point.updatedAt.toISOString(),
    };
  }

  async create(body: PointCreateDto, requesterUserId: number) {
    const point = await this.db.db.transaction(async (tx) => {
      const student = ensureFound(
        await tx.query.students.findFirst({
          where: eq(students.id, body.studentId),
          columns: { id: true },
        }),
        "student not found",
      );

      const now = new Date();
      const [created] = await tx
        .insert(pointsTable)
        .values({
          studentId: body.studentId,
          teacherId: requesterUserId,
          reasonId: body.reasonId,
          point: body.point,
          comment: body.comment,
          baseDate: now,
          updatedAt: now,
        })
        .$returningId();

      await tx
        .update(students)
        .set({ point: sql`${students.point} + ${body.point}` })
        .where(eq(students.id, body.studentId));

      const createdPoint = await tx.query.points.findFirst({
        where: eq(pointsTable.id, created.id),
        columns: {
          id: true,
          studentId: true,
          teacherId: true,
          reasonId: true,
          point: true,
          comment: true,
          baseDate: true,
          updatedAt: true,
        },
        with: {
          student: {
            columns: {
              id: true,
              stuid: true,
              name: true,
            },
          },
          teacher: {
            columns: {
              id: true,
              stuid: true,
              name: true,
            },
          },
        },
      });

      return ensureFound(createdPoint, "point not found");
    });

    return {
      point: this.serializePointRecord(point),
    };
  }

  async findAll(query: PointListQueryDto) {
    const page = query.page;

    let studentIdFilter: number | undefined;
    if (query.stuId !== undefined) {
      const student = await this.db.db.query.students.findFirst({
        where: eq(students.stuid, query.stuId),
        columns: { id: true },
      });

      if (!student) {
        return { points: [] };
      }

      studentIdFilter = student.id;
    }

    const pointRows = await this.db.db.query.points.findMany({
      where:
        studentIdFilter === undefined
          ? undefined
          : eq(pointsTable.studentId, studentIdFilter),
      columns: {
        id: true,
        studentId: true,
        teacherId: true,
        reasonId: true,
        point: true,
        comment: true,
        baseDate: true,
        updatedAt: true,
      },
      with: {
        student: {
          columns: {
            id: true,
            stuid: true,
            name: true,
          },
        },
        teacher: {
          columns: {
            id: true,
            stuid: true,
            name: true,
          },
        },
      },
      orderBy: [desc(pointsTable.id)],
      offset: (page - 1) * this.pageSize,
      limit: this.pageSize,
    });

    return {
      points: pointRows.map((row) => this.serializePointRecord(row)),
    };
  }

  async findStudents(query: PointStudentsQueryDto) {
    const page = query.page;

    const whereClause = and(
      query.grade ? eq(students.grade, query.grade) : undefined,
      query.class ? eq(students.class, query.class) : undefined,
      query.number ? eq(students.num, query.number) : undefined,
    );

    const studentRows = await this.db.db
      .select()
      .from(students)
      .where(whereClause)
      .orderBy(asc(students.grade), asc(students.class), asc(students.num))
      .offset((page - 1) * this.pageSize)
      .limit(this.pageSize);

    return { students: studentRows };
  }

  async findStudentById(studentId: number) {
    const student = ensureFound(
      await this.db.db.query.students.findFirst({
        where: eq(students.id, studentId),
        columns: {
          id: true,
          stuid: true,
          name: true,
          grade: true,
          class: true,
          num: true,
          point: true,
        },
      }),
      "student not found",
    );

    const pointRows = await this.db.db.query.points.findMany({
      where: eq(pointsTable.studentId, studentId),
      columns: {
        id: true,
        studentId: true,
        teacherId: true,
        reasonId: true,
        point: true,
        comment: true,
        baseDate: true,
        updatedAt: true,
      },
      with: {
        teacher: {
          columns: {
            id: true,
            stuid: true,
            name: true,
          },
        },
      },
      orderBy: [desc(pointsTable.id)],
    });

    return {
      student,
      points: pointRows.map((row) => this.serializePointRecord(row)),
    };
  }

  async findReasons() {
    const reasonRows = await this.db.db
      .select()
      .from(reasons)
      .orderBy(desc(reasons.id));
    return { reasons: reasonRows };
  }

  async createReason(body: PointReasonCreateDto) {
    const [created] = await this.db.db
      .insert(reasons)
      .values(body)
      .$returningId();
    const reason = await this.db.db.query.reasons.findFirst({
      where: eq(reasons.id, created.id),
    });
    return { reason: ensureFound(reason, "reason not found") };
  }

  async updateReason(id: number, body: PointReasonUpdateDto) {
    await this.db.db.update(reasons).set(body).where(eq(reasons.id, id));
    const reason = await this.db.db.query.reasons.findFirst({
      where: eq(reasons.id, id),
    });
    return { reason: ensureFound(reason, "reason not found") };
  }

  async removeReason(id: number) {
    const existingReason = await this.db.db.query.reasons.findFirst({
      where: eq(reasons.id, id),
      columns: { id: true },
    });

    ensureFound(existingReason, "reason not found");

    await this.db.db.delete(reasons).where(eq(reasons.id, id));
  }

  async update(id: number, body: PointUpdateDto, _actorUserId: number) {
    const point = await this.db.db.transaction(async (tx) => {
      const existingPoint = ensureFound(
        await tx.query.points.findFirst({
          where: eq(pointsTable.id, id),
          columns: {
            id: true,
            studentId: true,
            point: true,
          },
        }),
        "point not found",
      );

      await tx
        .update(pointsTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(pointsTable.id, id));

      if (body.point !== undefined) {
        const diff = body.point - existingPoint.point;
        if (diff !== 0) {
          await tx
            .update(students)
            .set({ point: sql`${students.point} + ${diff}` })
            .where(eq(students.id, existingPoint.studentId));
        }
      }

      const updatedPoint = await tx.query.points.findFirst({
        where: eq(pointsTable.id, id),
        columns: {
          id: true,
          studentId: true,
          teacherId: true,
          reasonId: true,
          point: true,
          comment: true,
          baseDate: true,
          updatedAt: true,
        },
        with: {
          student: {
            columns: {
              id: true,
              stuid: true,
              name: true,
            },
          },
          teacher: {
            columns: {
              id: true,
              stuid: true,
              name: true,
            },
          },
        },
      });

      return ensureFound(updatedPoint, "point not found");
    });

    return {
      point: this.serializePointRecord(point),
    };
  }

  async remove(id: number, _actorUserId: number) {
    await this.db.db.transaction(async (tx) => {
      const existingPoint = ensureFound(
        await tx.query.points.findFirst({
          where: eq(pointsTable.id, id),
          columns: {
            id: true,
            studentId: true,
            point: true,
          },
        }),
        "point not found",
      );

      await tx.delete(pointsTable).where(eq(pointsTable.id, id));
      await tx
        .update(students)
        .set({ point: sql`${students.point} - ${existingPoint.point}` })
        .where(eq(students.id, existingPoint.studentId));
    });
  }
}
