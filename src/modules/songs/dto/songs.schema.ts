import { z } from 'zod';

export const songIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const songCreateSchema = z.object({
  title: z.string().trim().min(1).max(100),
  url: z.string().trim().url(),
  duration: z.coerce.number().int().min(1),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export const songUpdateSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  url: z.string().trim().url().optional(),
  duration: z.coerce.number().int().min(1).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

const songEntitySchema = z.object({
  id: z.number().int(),
  title: z.string(),
  url: z.string().url(),
  duration: z.number().int(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

export const createResponseSchema = songEntitySchema;
export const findAllResponseSchema = z.array(songEntitySchema);
export const updateResponseSchema = songEntitySchema;

export type SongIdParams = z.infer<typeof songIdParamSchema>;
export type SongCreateInput = z.infer<typeof songCreateSchema>;
export type SongUpdateInput = z.infer<typeof songUpdateSchema>;