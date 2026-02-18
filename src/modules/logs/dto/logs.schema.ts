import { z } from 'zod';

const logStudentSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
});

const logUserSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
});

const logAccountSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  studentId: z.number().int().nullable(),
});

const logPointSchema = z.object({
  id: z.number().int(),
  studentId: z.number().int(),
  teacherId: z.number().int(),
  reasonId: z.number().int(),
  point: z.number().int(),
  comment: z.string(),
  baseDate: z.string().datetime(),
  updatedDate: z.string().datetime(),
  student: logStudentSchema,
  teacher: logUserSchema,
});

const logSongSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  url: z.string().url(),
  duration: z.number().int(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

const logDormRoomSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  grade: z.number().int(),
  dormName: z.string(),
  _count: z.object({
    dormUsers: z.number().int(),
    dormReport: z.number().int(),
  }),
});

const logCaseSchema = z.object({
  id: z.number().int(),
  status: z.enum(['OPEN', 'CLOSED', 'DISCONNECTED']),
  updatedDate: z.string().datetime(),
});

export const getPointLogsResponseSchema = z.array(logPointSchema);
export const getSongLogsResponseSchema = z.array(logSongSchema);
export const getDormLogsResponseSchema = z.array(logDormRoomSchema);
export const getAccountLogsResponseSchema = z.array(logAccountSchema);
export const getRemoteLogsResponseSchema = z.array(logCaseSchema);
