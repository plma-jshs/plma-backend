import { z } from 'zod';

const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export const accountIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const accountCreateSchema = z.object({
  stuid: z.coerce.number().int().min(1),
  password: z.string().trim().min(8).max(72),
  name: z.string().trim().min(1).max(30),
  studentId: z.coerce.number().int().min(1).optional(),
  phoneNumber: z.string().trim().regex(phoneRegex).optional(),
});

export const accountUpdateSchema = z.object({
  stuid: z.coerce.number().int().min(1).optional(),
  password: z.string().trim().min(8).max(72).optional(),
  name: z.string().trim().min(1).max(30).optional(),
  studentId: z.union([z.coerce.number().int().min(1), z.null()]).optional(),
  phoneNumber: z.union([z.string().trim().regex(phoneRegex), z.null()]).optional(),
});

export const accountListQuerySchema = z.object({
  page: z.coerce.number().int().min(1),
});

const accountStudentSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  grade: z.number().int(),
  class: z.number().int(),
  num: z.number().int(),
  point: z.number().int(),
});

const accountSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  studentId: z.number().int().nullable(),
  student: accountStudentSchema.nullable(),
});

export const createResponseSchema = accountSchema;
export const findAllResponseSchema = z.array(accountSchema);
export const updateResponseSchema = accountSchema;

export type AccountIdParams = z.infer<typeof accountIdParamSchema>;
export type AccountCreateInput = z.infer<typeof accountCreateSchema>;
export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>;
export type AccountListQuery = z.infer<typeof accountListQuerySchema>;