import { caseType } from '@/common/enum/caseType';
import { z } from 'zod';

export const caseScheduleIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const caseScheduleCreateSchema = z.object({
  date: z.date(),
  action: caseType,
});

export const caseScheduleUpdateSchema = z.object({
  date: z.date().optional(),
  action: caseType.optional(),
});

const caseScheduleEntitySchema = z.object({
  id: z.number().int(),
  date: z.date(),
  action: caseType,
});

export const createResponseSchema = caseScheduleEntitySchema;
export const findAllResponseSchema = z.array(caseScheduleEntitySchema);
export const updateResponseSchema = caseScheduleEntitySchema;

export type CaseScheduleIdParams = z.infer<typeof caseScheduleIdParamSchema>;
export type CaseScheduleCreateInput = z.infer<typeof caseScheduleCreateSchema>;
export type CaseScheduleUpdateInput = z.infer<typeof caseScheduleUpdateSchema>;