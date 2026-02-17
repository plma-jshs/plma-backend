import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { pointType} from '../enum/pointType';

export const IReason = z.object({
    id: z.int(),
    type: pointType,
    point: z.int(),
    comment: z.string(),
}).strict();

export type IReason = z.infer<typeof IReason>;
export class IReasonDto extends createZodDto(IReason) {}