import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const songIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const songCreateSchema = z.object({
  title: z.string().trim().min(1).max(100),
  url: z.string().trim().url(),
  duration: z.coerce.number().int().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export const songUpdateSchema = songCreateSchema.partial();

export const songListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
});

const songEntitySchema = z.object({
  id: z.number().int(),
  title: z.string(),
  url: z.string().url(),
  duration: z.number().int(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const createResponseSchema = songEntitySchema;
export const findAllResponseSchema = z.object({
  data: z.array(songEntitySchema),
  meta: z.object({
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    size: z.number().int().min(1),
    lastPage: z.number().int().min(0),
  }),
});
export const updateResponseSchema = songEntitySchema;

export class SongIdParamDto extends createZodDto(songIdParamSchema) {}
export class SongCreateDto extends createZodDto(songCreateSchema) {}
export class SongUpdateDto extends createZodDto(songUpdateSchema) {}
export class SongListQueryDto extends createZodDto(songListQuerySchema) {}
export class SongCreateResponseDto extends createZodDto(createResponseSchema) {}
export class SongFindAllResponseDto extends createZodDto(
  findAllResponseSchema,
) {}
export class SongUpdateResponseDto extends createZodDto(updateResponseSchema) {}
