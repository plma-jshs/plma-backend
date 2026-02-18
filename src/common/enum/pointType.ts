import {z} from 'zod';

export const pointType = z.enum(["PLUS", "MINUS", "ETC"]);
export type PointType = z.infer<typeof pointType>;