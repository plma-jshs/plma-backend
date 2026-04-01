import { Injectable, NotFoundException } from "@nestjs/common";
import { asc, eq, sql } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import { cases, caseSchedules } from "@/db/schema";
import { ensureFound } from "@/common/db/ensure-found";
import {
  CaseFindAllQueryDto,
  CaseFindAllScheduleQueryDto,
  CaseReplaceAllDto,
  CaseScheduleCreateDto,
  CaseScheduleUpdateDto,
  CaseUpdateDto,
} from "./dto/cases.schema";

@Injectable()
export class CasesService {
  constructor(private readonly db: DbService) {}

  private serializeCase(data: {
    id: number;
    isOpen: boolean;
    updatedAt: Date;
  }) {
    return {
      id: data.id,
      isOpen: data.isOpen,
      updatedAt: data.updatedAt.toISOString(),
    };
  }

  private serializeSchedule(data: { id: number; date: Date; isOpen: boolean }) {
    return {
      id: data.id,
      isOpen: data.isOpen,
      date: data.date.toISOString(),
    };
  }

  async findAll(query: CaseFindAllQueryDto) {
    const { page, size } = query;
    const [rows, totalRows] = await Promise.all([
      this.db.db
        .select()
        .from(cases)
        .orderBy(asc(cases.id))
        .offset((page - 1) * size)
        .limit(size),
      this.db.db.select({ total: sql<number>`count(*)` }).from(cases),
    ]);

    const total = Number(totalRows[0]?.total ?? 0);
    const lastPage = total === 0 ? 0 : Math.ceil(total / size);

    return {
      data: rows.map((row) => this.serializeCase(row)),
      meta: { total, page, size, lastPage },
    };
  }

  async findOne(id: number) {
    const row = await this.db.db.query.cases.findFirst({
      where: eq(cases.id, id),
    });
    return row ? this.serializeCase(row) : null;
  }

  async update(id: number, updateCaseInput: CaseUpdateDto) {
    const existingCase = await this.db.db.query.cases.findFirst({
      where: eq(cases.id, id),
    });
    ensureFound(existingCase, "case not found");

    await this.db.db
      .update(cases)
      .set({ ...updateCaseInput, updatedAt: new Date() })
      .where(eq(cases.id, id));

    const row = ensureFound(
      await this.db.db.query.cases.findFirst({ where: eq(cases.id, id) }),
      "case not found",
    );

    return this.serializeCase(row);
  }

  async updateAll(body: CaseReplaceAllDto) {
    const targetIsOpen = body.isOpen;

    const [totalCasesRow] = await this.db.db
      .select({ count: sql<number>`count(*)` })
      .from(cases);
    const [disconnectedRow] = await this.db.db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(eq(cases.isConnected, false));
    const [connectedRow] = await this.db.db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(eq(cases.isConnected, true));

    await this.db.db
      .update(cases)
      .set({ isOpen: targetIsOpen, updatedAt: new Date() })
      .where(eq(cases.isConnected, true));

    return {
      targetIsOpen,
      totalCases: Number(totalCasesRow?.count ?? 0),
      excludedDisconnectedCount: Number(disconnectedRow?.count ?? 0),
      updatedCount: Number(connectedRow?.count ?? 0),
    };
  }

  async createSchedule(body: CaseScheduleCreateDto) {
    const [created] = await this.db.db
      .insert(caseSchedules)
      .values({
        date: body.date,
        isOpen: body.isOpen,
      })
      .$returningId();
    const row = ensureFound(
      await this.db.db.query.caseSchedules.findFirst({
        where: eq(caseSchedules.id, created.id),
      }),
      "case schedule not found",
    );

    return this.serializeSchedule(row);
  }

  async findSchedules(query: CaseFindAllScheduleQueryDto) {
    const { page, size } = query;
    const [rows, totalRows] = await Promise.all([
      this.db.db
        .select()
        .from(caseSchedules)
        .orderBy(asc(caseSchedules.date))
        .offset((page - 1) * size)
        .limit(size),
      this.db.db.select({ total: sql<number>`count(*)` }).from(caseSchedules),
    ]);

    const total = Number(totalRows[0]?.total ?? 0);
    const lastPage = total === 0 ? 0 : Math.ceil(total / size);

    return {
      data: rows.map((row) => this.serializeSchedule(row)),
      meta: { total, page, size, lastPage },
    };
  }

  async updateSchedule(id: number, body: CaseScheduleUpdateDto) {
    const existingSchedule = await this.db.db.query.caseSchedules.findFirst({
      where: eq(caseSchedules.id, id),
    });
    ensureFound(existingSchedule, "case schedule not found");

    await this.db.db
      .update(caseSchedules)
      .set({
        ...body,
        date: body.date,
      })
      .where(eq(caseSchedules.id, id));

    const row = ensureFound(
      await this.db.db.query.caseSchedules.findFirst({
        where: eq(caseSchedules.id, id),
      }),
      "case schedule not found",
    );

    return this.serializeSchedule(row);
  }

  async removeSchedule(id: number) {
    const existingSchedule = await this.db.db.query.caseSchedules.findFirst({
      where: eq(caseSchedules.id, id),
      columns: { id: true },
    });

    ensureFound(existingSchedule, "case schedule not found");

    await this.db.db.delete(caseSchedules).where(eq(caseSchedules.id, id));
  }
}
