import {z} from 'zod';
import { IReason } from './IReason';

export const IPoint = z.object({
    id: z.int(),
    studentId: z.int(),
    teacherId: z.int(),
    reason: IReason,
    baseDate: z.iso.datetime(),
    updatedDate: z.iso.datetime(),
}).strict();

export type IPoint = z.infer<typeof IPoint>;