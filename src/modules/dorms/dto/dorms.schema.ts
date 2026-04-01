import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const dormReportIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const dormAssignmentMemberSchema = z.object({
  userId: z.coerce.number().int().min(1),
  bedPosition: z.coerce.number().int().min(1),
});

export const dormAssignmentRoomSchema = z.object({
  roomId: z.coerce.number().int().min(1),
  members: z.array(dormAssignmentMemberSchema),
});

export const dormAssignmentsUpsertSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  semester: z.union([z.literal(1), z.literal(2)]),
  rooms: z.array(dormAssignmentRoomSchema).min(1),
});

export const dormAssignmentsQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  semester: z.union([z.literal(1), z.literal(2)]),
});

export const dormReportsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
});

const dormReportMutationSchema = z.object({
  userId: z.coerce.number().int().min(1),
  roomId: z.coerce.number().int().min(1),
  description: z.string().trim().min(1).max(1000),
  imageUrl: z.string().trim().url().optional(),
  imageKey: z.string().trim().max(255).optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED"]),
  comment: z.string().trim().max(500),
});

export const dormReportCreateSchema = dormReportMutationSchema
  .omit({ status: true, comment: true })
  .extend({
    imageUrl: z.string().trim().url().optional(),
    imageKey: z.string().trim().max(255).optional(),
  });

export const dormReportUpdateSchema = dormReportMutationSchema
  .omit({ userId: true, roomId: true })
  .partial();

const dormUserBriefSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
});

const dormRoomBriefSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  capacity: z.number().int(),
  grade: z.number().int(),
  dormName: z.string(),
});

const dormRoomSummarySchema = dormRoomBriefSchema.omit({
  capacity: true,
  grade: true,
});

const dormAssignmentMemberResponseSchema = z.object({
  userId: z.number().int(),
  bedPosition: z.number().int(),
  user: dormUserBriefSchema,
});

const dormAssignmentRoomResponseSchema = z.object({
  roomId: z.number().int(),
  room: dormRoomBriefSchema,
  members: z.array(dormAssignmentMemberResponseSchema),
});

const dormReportResponseSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  roomId: z.number().int(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  imageKey: z.string().nullable(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED"]),
  comment: z.string().nullable(),
  user: dormUserBriefSchema,
  room: dormRoomSummarySchema,
});

export const findAssignmentsResponseSchema = z.object({
  year: z.number().int(),
  semester: z.union([z.literal(1), z.literal(2)]),
  rooms: z.array(dormAssignmentRoomResponseSchema),
});
export const upsertAssignmentsResponseSchema = z.object({
  year: z.number().int(),
  semester: z.union([z.literal(1), z.literal(2)]),
  roomCount: z.number().int(),
  assignedUserCount: z.number().int(),
});
export const createReportResponseSchema = dormReportResponseSchema;
export const findReportsResponseSchema = z.object({
  data: z.array(dormReportResponseSchema),
  meta: z.object({
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    size: z.number().int().min(1),
    lastPage: z.number().int().min(0),
  }),
});
export const updateReportResponseSchema = dormReportResponseSchema;

export class DormReportIdParamDto extends createZodDto(
  dormReportIdParamSchema,
) {}
export class DormAssignmentsUpsertDto extends createZodDto(
  dormAssignmentsUpsertSchema,
) {}
export class DormAssignmentsQueryDto extends createZodDto(
  dormAssignmentsQuerySchema,
) {}
export class DormReportsQueryDto extends createZodDto(dormReportsQuerySchema) {}
export class DormReportCreateDto extends createZodDto(dormReportCreateSchema) {}
export class DormReportUpdateDto extends createZodDto(dormReportUpdateSchema) {}
export class DormFindAssignmentsResponseDto extends createZodDto(
  findAssignmentsResponseSchema,
) {}
export class DormUpsertAssignmentsResponseDto extends createZodDto(
  upsertAssignmentsResponseSchema,
) {}
export class DormCreateReportResponseDto extends createZodDto(
  createReportResponseSchema,
) {}
export class DormFindReportsResponseDto extends createZodDto(
  findReportsResponseSchema,
) {}
export class DormUpdateReportResponseDto extends createZodDto(
  updateReportResponseSchema,
) {}
