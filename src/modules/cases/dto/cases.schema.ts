import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const caseIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

const pagingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
});

const caseMutationSchema = z.object({
  isOpen: z.boolean(),
});

export const updateCaseSchema = caseMutationSchema.partial();
export const replaceAllCaseSchema = caseMutationSchema;

const caseEntitySchema = z.object({
  id: z.number().int(),
  isOpen: z.boolean(),
  updatedAt: z.iso.datetime(),
});

const listMetaSchema = z.object({
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  size: z.number().int().min(1),
  lastPage: z.number().int().min(0),
});

export const findAllQuerySchema = pagingQuerySchema;

export const findAllResponseSchema = z.object({
  data: z.array(caseEntitySchema),
  meta: listMetaSchema,
});
export const replaceAllResponseSchema = z.object({
  targetIsOpen: z.boolean(),
  totalCases: z.number().int(),
  excludedDisconnectedCount: z.number().int(),
  updatedCount: z.number().int(),
});
export const findOneResponseSchema = caseEntitySchema.nullable();
export const updateResponseSchema = caseEntitySchema;

export const caseScheduleIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const caseScheduleCreateSchema = z.object({
  date: z.iso.datetime(),
  isOpen: z.boolean(),
});

export const caseScheduleUpdateSchema = caseScheduleCreateSchema.partial();

export const findAllScheduleQuerySchema = pagingQuerySchema;

const caseScheduleEntitySchema = z.object({
  id: z.number().int(),
  date: z.iso.datetime(),
  isOpen: z.boolean(),
});

export const createScheduleResponseSchema = caseScheduleEntitySchema;
export const findAllScheduleResponseSchema = z.object({
  data: z.array(caseScheduleEntitySchema),
  meta: listMetaSchema,
});
export const updateScheduleResponseSchema = caseScheduleEntitySchema;

export class CaseIdParamDto extends createZodDto(caseIdParamSchema) {}
export class CaseFindAllQueryDto extends createZodDto(findAllQuerySchema) {}
export class CaseUpdateDto extends createZodDto(updateCaseSchema) {}
export class CaseReplaceAllDto extends createZodDto(replaceAllCaseSchema) {}
export class CaseScheduleIdParamDto extends createZodDto(
  caseScheduleIdParamSchema,
) {}
export class CaseFindAllScheduleQueryDto extends createZodDto(
  findAllScheduleQuerySchema,
) {}
export class CaseScheduleCreateDto extends createZodDto(
  caseScheduleCreateSchema,
) {}
export class CaseScheduleUpdateDto extends createZodDto(
  caseScheduleUpdateSchema,
) {}
export class CaseFindAllResponseDto extends createZodDto(
  findAllResponseSchema,
) {}
export class CaseReplaceAllResponseDto extends createZodDto(
  replaceAllResponseSchema,
) {}
export class CaseUpdateResponseDto extends createZodDto(updateResponseSchema) {}
export class CaseCreateScheduleResponseDto extends createZodDto(
  createScheduleResponseSchema,
) {}
export class CaseFindAllScheduleResponseDto extends createZodDto(
  findAllScheduleResponseSchema,
) {}
export class CaseUpdateScheduleResponseDto extends createZodDto(
  updateScheduleResponseSchema,
) {}
