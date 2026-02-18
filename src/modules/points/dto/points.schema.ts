import { pointType } from '@/common/enum/pointType';
import { z } from 'zod';

export const pointIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const pointListQuerySchema = z.object({
  stuId: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1),
});

export const pointCreateSchema = z.object({
  studentId: z.coerce.number().int().min(1),
  reasonId: z.coerce.number().int().min(1),
  point: z.coerce.number().int().min(0),
  comment: z.string().trim().min(1).max(255),
});

export const pointUpdateSchema = z.object({
  reasonId: z.coerce.number().int().min(1).optional(),
  point: z.coerce.number().int().min(0).optional(),
  comment: z.string().trim().min(1).max(255).optional(),
});

export const pointStudentsQuerySchema = z.object({
  grade: z.coerce.number().int().min(1).optional(),
  class: z.coerce.number().int().min(1).optional(),
  number: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1),
});

export const pointReasonSchema = z.object({
  type: pointType,
  point: z.coerce.number().int().min(0),
  comment: z.string().trim().min(1).max(255),
});

export const pointReasonUpdateSchema = z.object({
  type: pointType.optional(),
  point: z.coerce.number().int().min(0).optional(),
  comment: z.string().trim().min(1).max(255).optional(),
});

const pointStudentSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  grade: z.number().int(),
  class: z.number().int(),
  num: z.number().int(),
  point: z.number().int(),
});

const pointStudentBriefSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
});

const pointTeacherSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
});

const reasonSchema = z.object({
  id: z.number().int(),
  type: pointType,
  point: z.number().int(),
  comment: z.string(),
});

const pointRecordSchema = z.object({
  id: z.number().int(),
  studentId: z.number().int(),
  teacherId: z.number().int(),
  reasonId: z.number().int(),
  point: z.number().int(),
  comment: z.string(),
  baseDate: z.string().datetime(),
  updatedDate: z.string().datetime(),
  student: pointStudentBriefSchema,
  teacher: pointTeacherSchema,
});

const pointRecordWithoutStudentSchema = z.object({
  id: z.number().int(),
  studentId: z.number().int(),
  teacherId: z.number().int(),
  reasonId: z.number().int(),
  point: z.number().int(),
  comment: z.string(),
  baseDate: z.string().datetime(),
  updatedDate: z.string().datetime(),
  teacher: pointTeacherSchema,
});

export const createResponseSchema = z.object({ point: pointRecordSchema });
export const findAllResponseSchema = z.object({ points: z.array(pointRecordSchema) });
export const updateResponseSchema = z.object({ point: pointRecordSchema });
export const findStudentsResponseSchema = z.object({ students: z.array(pointStudentSchema) });
export const findStudentByIdResponseSchema = z.object({
  student: pointStudentSchema,
  points: z.array(pointRecordWithoutStudentSchema),
});
export const findReasonsResponseSchema = z.object({ reasons: z.array(reasonSchema) });
export const createReasonResponseSchema = z.object({ reason: reasonSchema });
export const updateReasonResponseSchema = z.object({ reason: reasonSchema });

export type PointIdParams = z.infer<typeof pointIdParamSchema>;
export type PointListQuery = z.infer<typeof pointListQuerySchema>;
export type PointCreateInput = z.infer<typeof pointCreateSchema>;
export type PointUpdateInput = z.infer<typeof pointUpdateSchema>;
export type PointStudentsQuery = z.infer<typeof pointStudentsQuerySchema>;
export type PointReasonCreateInput = z.infer<typeof pointReasonSchema>;
export type PointReasonUpdateInput = z.infer<typeof pointReasonUpdateSchema>;