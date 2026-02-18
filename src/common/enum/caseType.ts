import {z} from 'zod';

export const caseType = z.enum(["OPEN", "CLOSE"]);
export type CaseType = z.infer<typeof caseType>;