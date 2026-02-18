import { z } from 'zod';

export const caseIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const updateCaseSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED', 'DISCONNECTED']).optional(),
});

const caseEntitySchema = z.object({
  id: z.number().int(),
  status: z.enum(['OPEN', 'CLOSED', 'DISCONNECTED']),
  updatedDate: z.string().datetime(),
});

export const findAllResponseSchema = z.array(caseEntitySchema);
export const replaceAllResponseSchema = z.object({
  targetStatus: z.enum(['OPEN', 'CLOSED']),
  totalCases: z.number().int(),
  excludedDisconnectedCount: z.number().int(),
  updatedCount: z.number().int(),
});
export const findOneResponseSchema = caseEntitySchema.nullable();
export const updateResponseSchema = caseEntitySchema;

export type CaseIdParams = z.infer<typeof caseIdParamSchema>;
export type CaseUpdateInput = z.infer<typeof updateCaseSchema>;