import { z } from 'zod';

import { caseStatusType } from '@/common/enum/caseType';

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

export type CaseIdParams = z.infer<typeof caseIdParamSchema>;
export type CaseUpdateInput = z.infer<typeof updateCaseSchema>;