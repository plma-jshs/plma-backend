import { z } from "zod";
import { createZodDto } from "nestjs-zod";

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

export const accountUpdateSchema = accountCreateSchema.partial().extend({
  studentId: z.union([z.coerce.number().int().min(1), z.null()]).optional(),
  phoneNumber: z
    .union([z.string().trim().regex(phoneRegex), z.null()])
    .optional(),
});

export const accountListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
});

const accountStudentSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
});

const accountSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  studentId: z.number().int().nullable(),
  student: accountStudentSchema.nullable(),
});

const accountPaginationMetaSchema = z.object({
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  lastPage: z.number().int().min(0),
});

export const createResponseSchema = accountSchema;
export const findAllResponseSchema = z.object({
  data: z.array(accountSchema),
  meta: accountPaginationMetaSchema,
});
export const findOneResponseSchema = accountSchema;
export const updateResponseSchema = accountSchema;

export class AccountIdParamDto extends createZodDto(accountIdParamSchema) {}
export class AccountCreateDto extends createZodDto(accountCreateSchema) {}
export class AccountUpdateDto extends createZodDto(accountUpdateSchema) {}
export class AccountListQueryDto extends createZodDto(accountListQuerySchema) {}
export class AccountCreateResponseDto extends createZodDto(
  createResponseSchema,
) {}
export class AccountFindAllResponseDto extends createZodDto(
  findAllResponseSchema,
) {}
export class AccountFindOneResponseDto extends createZodDto(
  findOneResponseSchema,
) {}
export class AccountUpdateResponseDto extends createZodDto(
  updateResponseSchema,
) {}
