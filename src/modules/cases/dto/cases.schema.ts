import { z } from 'zod';

import { caseActionType, caseStatusType } from '@/common/enum/caseType';

export const caseIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const updateCaseSchema = z.object({
  status: caseStatusType.optional(),
});

const caseEntitySchema = z.object({
  id: z.number().int(),
  status: caseStatusType,
  updatedDate: z.date(),
});

export const findAllResponseSchema = z.array(caseEntitySchema);
export const replaceAllResponseSchema = z.object({
  targetStatus: caseStatusType,
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
  date: z.date(),
  action: caseActionType,
});

export const caseScheduleUpdateSchema = z.object({
  date: z.date().optional(),
  action: caseActionType.optional(),
});

const caseScheduleEntitySchema = z.object({
  id: z.number().int(),
  date: z.date(),
  action: caseActionType,
});

export const createScheduleResponseSchema = caseScheduleEntitySchema;
export const findAllScheduleResponseSchema = z.array(caseScheduleEntitySchema);
export const updateScheduleResponseSchema = caseScheduleEntitySchema;

export type CaseIdParams = z.infer<typeof caseIdParamSchema>;
export type CaseUpdateInput = z.infer<typeof updateCaseSchema>;

export type CaseScheduleIdParams = z.infer<typeof caseScheduleIdParamSchema>;
export type CaseScheduleCreateInput = z.infer<typeof caseScheduleCreateSchema>;
export type CaseScheduleUpdateInput = z.infer<typeof caseScheduleUpdateSchema>;