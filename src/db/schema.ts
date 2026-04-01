import {
  boolean,
  date,
  datetime,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const reasonTypeEnum = mysqlEnum("reason_type", [
  "PLUS",
  "MINUS",
  "ETC",
]);
export const songStatusEnum = mysqlEnum("song_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const dormNameEnum = mysqlEnum("dorm_name", ["송죽관", "동백관"]);
export const dormReportStatusEnum = mysqlEnum("dorm_report_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
]);

export const students = mysqlTable(
  "students",
  {
    id: int("id").autoincrement().primaryKey(),
    stuid: int("stuid").notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    grade: int("grade").notNull(),
    class: int("class").notNull(),
    num: int("num").notNull(),
    point: int("point").notNull().default(0),
  },
  (table) => ({
    stuidUnique: unique("students_stuid_key").on(table.stuid),
  }),
);

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    stuid: int("stuid").notNull(),
    password: varchar("password", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    studentId: int("studentId"),
    phoneNumber: varchar("phoneNumber", { length: 11 }),
  },
  (table) => ({
    stuidUnique: unique("users_stuid_key").on(table.stuid),
    studentIdUnique: unique("users_studentId_key").on(table.studentId),
  }),
);

export const reasons = mysqlTable("reasons", {
  id: int("id").autoincrement().primaryKey(),
  type: reasonTypeEnum.notNull(),
  point: int("point").notNull(),
  comment: varchar("comment", { length: 191 }).notNull(),
});

export const points = mysqlTable(
  "points",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    teacherId: int("teacherId").notNull(),
    reasonId: int("reasonId").notNull(),
    point: int("point").notNull().default(0),
    comment: varchar("comment", { length: 191 }).notNull().default(""),
    baseDate: date("baseDate", { mode: "date" }).notNull(),
    updatedAt: datetime("updatedAt", { mode: "date" }).notNull(),
  },
  (table) => ({
    studentIdIndex: index("points_studentId_idx").on(table.studentId),
    teacherIdIndex: index("points_teacherId_idx").on(table.teacherId),
    reasonIdIndex: index("points_reasonId_idx").on(table.reasonId),
  }),
);

export const cases = mysqlTable("cases", {
  id: int("id").primaryKey(),
  isOpen: boolean("isOpen").notNull().default(true),
  isConnected: boolean("isConnected").notNull().default(false),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull(),
});

export const caseSchedules = mysqlTable("case_schedules", {
  id: int("id").autoincrement().primaryKey(),
  date: datetime("date", { mode: "date" }).notNull(),
  isOpen: boolean("isOpen").notNull().default(false),
});

export const songs = mysqlTable("songs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 191 }).notNull(),
  url: varchar("url", { length: 191 }).notNull(),
  duration: int("duration").notNull(),
  status: songStatusEnum.notNull().default("PENDING"),
});

export const dormRooms = mysqlTable(
  "dorm_rooms",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    capacity: int("capacity").notNull(),
    grade: int("grade").notNull(),
    dormName: dormNameEnum.notNull(),
  },
  (table) => ({
    nameUnique: unique("dorm_rooms_name_key").on(table.name),
  }),
);

export const dormUsers = mysqlTable(
  "dorm_users",
  {
    id: int("id").autoincrement().primaryKey(),
    roomId: int("roomId").notNull(),
    userId: int("userId").notNull(),
    year: int("year").notNull(),
    semester: int("semester").notNull(),
    bedPosition: int("bedPosition").notNull(),
  },
  (table) => ({
    roomIdIndex: index("dorm_users_roomId_idx").on(table.roomId),
    userIdIndex: index("dorm_users_userId_idx").on(table.userId),
    userSemesterUnique: unique("dorm_users_userId_year_semester_key").on(
      table.userId,
      table.year,
      table.semester,
    ),
    roomSemesterBedUnique: unique(
      "dorm_users_roomId_year_semester_bedPosition_key",
    ).on(table.roomId, table.year, table.semester, table.bedPosition),
  }),
);

export const dormReports = mysqlTable(
  "dorm_reports",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    roomId: int("roomId").notNull(),
    description: varchar("description", { length: 191 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 191 }),
    imageKey: varchar("imageKey", { length: 191 }),
    status: dormReportStatusEnum.notNull().default("PENDING"),
    comment: varchar("comment", { length: 191 }),
  },
  (table) => ({
    userIdIndex: index("dorm_reports_userId_idx").on(table.userId),
    roomIdIndex: index("dorm_reports_roomId_idx").on(table.roomId),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.studentId],
    references: [students.id],
  }),
  givenPoints: many(points),
  dormUsers: many(dormUsers),
  reports: many(dormReports),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.id],
    references: [users.studentId],
  }),
  points: many(points),
}));

export const reasonsRelations = relations(reasons, ({ many }) => ({
  points: many(points),
}));

export const pointsRelations = relations(points, ({ one }) => ({
  student: one(students, {
    fields: [points.studentId],
    references: [students.id],
  }),
  teacher: one(users, {
    fields: [points.teacherId],
    references: [users.id],
  }),
  reason: one(reasons, {
    fields: [points.reasonId],
    references: [reasons.id],
  }),
}));

export const dormRoomsRelations = relations(dormRooms, ({ many }) => ({
  dormUsers: many(dormUsers),
  dormReports: many(dormReports),
}));

export const dormUsersRelations = relations(dormUsers, ({ one }) => ({
  room: one(dormRooms, {
    fields: [dormUsers.roomId],
    references: [dormRooms.id],
  }),
  user: one(users, {
    fields: [dormUsers.userId],
    references: [users.id],
  }),
}));

export const dormReportsRelations = relations(dormReports, ({ one }) => ({
  user: one(users, {
    fields: [dormReports.userId],
    references: [users.id],
  }),
  room: one(dormRooms, {
    fields: [dormReports.roomId],
    references: [dormRooms.id],
  }),
}));
