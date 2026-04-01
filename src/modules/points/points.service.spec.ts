import { NotFoundException } from "@nestjs/common";
import { DbService } from "@/db/db.service";
import { students, points as pointsTable } from "@/db/schema";
import { PointsService } from "./points.service";

describe("PointsService", () => {
  const studentsFindFirstMock = jest.fn();
  const pointsFindFirstMock = jest.fn();
  const insertValuesMock = jest.fn();
  const updateSetArgs: Array<Record<string, unknown>> = [];
  const updateSetWhereMock = jest.fn();
  const deleteWhereMock = jest.fn();

  const updateSetMock = jest
    .fn()
    .mockImplementation((values: Record<string, unknown>) => {
      updateSetArgs.push(values);
      return {
        where: updateSetWhereMock,
      };
    });

  const tx = {
    query: {
      students: {
        findFirst: studentsFindFirstMock,
      },
      points: {
        findFirst: pointsFindFirstMock,
      },
    },
    insert: jest.fn().mockReturnValue({
      values: insertValuesMock,
    }),
    update: jest.fn().mockImplementation(() => ({
      set: updateSetMock,
    })),
    delete: jest.fn().mockImplementation(() => ({
      where: deleteWhereMock,
    })),
  };

  const transactionMock = jest.fn();

  const dbService = {
    db: {
      transaction: transactionMock,
    },
  } as unknown as DbService;

  let service: PointsService;

  beforeEach(() => {
    jest.clearAllMocks();
    updateSetArgs.length = 0;

    insertValuesMock.mockReturnValue({
      $returningId: jest.fn().mockResolvedValue([{ id: 11 }]),
    });
    updateSetWhereMock.mockResolvedValue(undefined);
    deleteWhereMock.mockResolvedValue(undefined);

    transactionMock.mockImplementation(
      async (callback: (trx: typeof tx) => unknown) => callback(tx),
    );

    service = new PointsService(dbService);
  });

  function extractPrimitiveValues(input: unknown): unknown[] {
    const visited = new WeakSet<object>();
    const values: unknown[] = [];

    const walk = (target: unknown) => {
      if (target === null || target === undefined) {
        return;
      }

      const type = typeof target;
      if (type !== "object" && type !== "function") {
        values.push(target);
        return;
      }

      const objectTarget = target as object;
      if (visited.has(objectTarget)) {
        return;
      }
      visited.add(objectTarget);

      for (const key of Reflect.ownKeys(objectTarget)) {
        const descriptor = Object.getOwnPropertyDescriptor(objectTarget, key);
        if (!descriptor) {
          continue;
        }

        if ("value" in descriptor) {
          walk(descriptor.value);
          continue;
        }

        if (descriptor.get) {
          try {
            walk((objectTarget as Record<PropertyKey, unknown>)[key]);
          } catch {
            // ignore getter side effects for test introspection
          }
        }
      }
    };

    walk(input);
    return values;
  }

  describe("create", () => {
    it("creates point and updates student cumulative point", async () => {
      const now = new Date("2026-04-02T10:00:00.000Z");
      jest.useFakeTimers().setSystemTime(now);

      studentsFindFirstMock.mockResolvedValue({ id: 2 });
      pointsFindFirstMock.mockResolvedValue({
        id: 11,
        studentId: 2,
        teacherId: 9,
        reasonId: 3,
        point: 5,
        comment: "잘했음",
        baseDate: now,
        updatedAt: now,
        student: { id: 2, stuid: 2301, name: "홍길동" },
        teacher: { id: 9, stuid: 1201, name: "교사" },
      });

      const result = await service.create(
        { studentId: 2, reasonId: 3, point: 5, comment: "잘했음" },
        9,
      );

      expect(tx.insert).toHaveBeenCalledTimes(1);
      expect(tx.update).toHaveBeenNthCalledWith(1, students);
      expect(updateSetArgs).toHaveLength(1);
      const createStudentUpdate = updateSetArgs[0];
      const createSqlValues = extractPrimitiveValues(createStudentUpdate.point);
      expect(createSqlValues).toContain(5);

      expect(result.point.point).toBe(5);
      expect(result.point.baseDate).toBe("2026-04-02T10:00:00.000Z");
      expect(result.point.updatedAt).toBe("2026-04-02T10:00:00.000Z");

      jest.useRealTimers();
    });

    it("throws NotFoundException when target student is missing", async () => {
      studentsFindFirstMock.mockResolvedValue(null);

      await expect(
        service.create(
          { studentId: 2, reasonId: 3, point: 5, comment: "잘했음" },
          9,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("update", () => {
    it("updates point and applies cumulative diff to student point", async () => {
      const now = new Date("2026-04-02T11:00:00.000Z");
      jest.useFakeTimers().setSystemTime(now);

      pointsFindFirstMock
        .mockResolvedValueOnce({ id: 10, studentId: 2, point: 3 })
        .mockResolvedValueOnce({
          id: 10,
          studentId: 2,
          teacherId: 9,
          reasonId: 3,
          point: 7,
          comment: "수정",
          baseDate: new Date("2026-04-01T10:00:00.000Z"),
          updatedAt: now,
          student: { id: 2, stuid: 2301, name: "홍길동" },
          teacher: { id: 9, stuid: 1201, name: "교사" },
        });

      const result = await service.update(10, { point: 7, comment: "수정" }, 9);

      expect(tx.update).toHaveBeenNthCalledWith(1, pointsTable);
      expect(tx.update).toHaveBeenNthCalledWith(2, students);
      expect(updateSetArgs).toHaveLength(2);

      const studentDiffUpdate = updateSetArgs[1];
      const diffSqlValues = extractPrimitiveValues(studentDiffUpdate.point);
      expect(diffSqlValues).toContain(4);

      expect(result.point.point).toBe(7);
      expect(result.point.updatedAt).toBe("2026-04-02T11:00:00.000Z");

      jest.useRealTimers();
    });

    it("throws NotFoundException when point to update is missing", async () => {
      pointsFindFirstMock.mockResolvedValueOnce(null);

      await expect(
        service.update(10, { comment: "수정" }, 9),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("remove", () => {
    it("deletes point and subtracts cumulative point from student", async () => {
      pointsFindFirstMock.mockResolvedValueOnce({
        id: 12,
        studentId: 2,
        point: 4,
      });

      await service.remove(12, 9);

      expect(tx.delete).toHaveBeenCalledTimes(1);
      expect(tx.update).toHaveBeenNthCalledWith(1, students);
    });

    it("throws NotFoundException when deleting non-existing point", async () => {
      pointsFindFirstMock.mockResolvedValueOnce(null);

      await expect(service.remove(999, 9)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(tx.delete).not.toHaveBeenCalled();
    });
  });
});
