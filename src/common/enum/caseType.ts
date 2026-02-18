import {z} from 'zod';

export const caseActionType = z.enum(["OPEN", "CLOSE"]);
export type CaseActionType = z.infer<typeof caseActionType>;

export const caseStatusType = z.enum(["OPEN", "CLOSED", "DISCONNECTED"]);
export type CaseStatusType = z.infer<typeof caseStatusType>;