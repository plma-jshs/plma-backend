import { pointType } from "@/common/enum/pointType";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const pointIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const pointListQuerySchema = z.object({
  stuId: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const pointCreateSchema = z.object({
  studentId: z.coerce.number().int().min(1),
  reasonId: z.coerce.number().int().min(1),
  point: z.coerce.number().int().min(0),
  comment: z.string().trim().min(1).max(255),
});

export const pointUpdateSchema = pointCreateSchema
  .omit({ studentId: true })
  .partial();

export const pointStudentsQuerySchema = z.object({
  grade: z.coerce.number().int().min(1).optional(),
  class: z.coerce.number().int().min(1).optional(),
  number: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const pointReasonSchema = z.object({
  type: pointType,
  point: z.coerce.number().int().min(0),
  comment: z.string().trim().min(1).max(255),
});

export const pointReasonUpdateSchema = pointReasonSchema.partial();

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
  baseDate: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  student: pointStudentBriefSchema,
  teacher: pointTeacherSchema,
});

const pointRecordWithoutStudentSchema = pointRecordSchema.omit({
  student: true,
});

export const createResponseSchema = z.object({ point: pointRecordSchema });
export const findAllResponseSchema = z.object({
  points: z.array(pointRecordSchema),
});
export const updateResponseSchema = z.object({ point: pointRecordSchema });
export const findStudentsResponseSchema = z.object({
  students: z.array(pointStudentSchema),
});
export const findStudentByIdResponseSchema = z.object({
  student: pointStudentSchema,
  points: z.array(pointRecordWithoutStudentSchema),
});
export const findReasonsResponseSchema = z.object({
  reasons: z.array(reasonSchema),
});
export const createReasonResponseSchema = z.object({ reason: reasonSchema });
export const updateReasonResponseSchema = z.object({ reason: reasonSchema });

export class PointIdParamDto extends createZodDto(pointIdParamSchema) {}
export class PointListQueryDto extends createZodDto(pointListQuerySchema) {}
export class PointCreateDto extends createZodDto(pointCreateSchema) {}
export class PointUpdateDto extends createZodDto(pointUpdateSchema) {}
export class PointStudentsQueryDto extends createZodDto(
  pointStudentsQuerySchema,
) {}
export class PointReasonCreateDto extends createZodDto(pointReasonSchema) {}
export class PointReasonUpdateDto extends createZodDto(
  pointReasonUpdateSchema,
) {}
export class PointCreateResponseDto extends createZodDto(
  createResponseSchema,
) {}
export class PointFindAllResponseDto extends createZodDto(
  findAllResponseSchema,
) {}
export class PointUpdateResponseDto extends createZodDto(
  updateResponseSchema,
) {}
export class PointFindStudentsResponseDto extends createZodDto(
  findStudentsResponseSchema,
) {}
export class PointFindStudentByIdResponseDto extends createZodDto(
  findStudentByIdResponseSchema,
) {}
export class PointFindReasonsResponseDto extends createZodDto(
  findReasonsResponseSchema,
) {}
export class PointCreateReasonResponseDto extends createZodDto(
  createReasonResponseSchema,
) {}
export class PointUpdateReasonResponseDto extends createZodDto(
  updateReasonResponseSchema,
) {}
