import { z } from 'zod';

export const caseIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const updateCaseSchema = z.object({
  isOpen: z.boolean().optional(),
});

const caseEntitySchema = z.object({
  id: z.number().int(),
  isOpen: z.boolean(),
  updatedDate: z.date(),
});

export const findAllResponseSchema = z.array(caseEntitySchema);
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
  date: z.date(),
  isOpen: z.boolean(),
});

export const caseScheduleUpdateSchema = z.object({
  date: z.date().optional(),
  isOpen: z.boolean().optional(),
});

const caseScheduleEntitySchema = z.object({
  id: z.number().int(),
  date: z.date(),
  isOpen: z.boolean(),
});

export const createScheduleResponseSchema = caseScheduleEntitySchema;
export const findAllScheduleResponseSchema = z.array(caseScheduleEntitySchema);
export const updateScheduleResponseSchema = caseScheduleEntitySchema;

export type CaseIdParams = z.infer<typeof caseIdParamSchema>;
export type CaseUpdateInput = z.infer<typeof updateCaseSchema>;

export type CaseScheduleIdParams = z.infer<typeof caseScheduleIdParamSchema>;
export type CaseScheduleCreateInput = z.infer<typeof caseScheduleCreateSchema>;
export type CaseScheduleUpdateInput = z.infer<typeof caseScheduleUpdateSchema>;