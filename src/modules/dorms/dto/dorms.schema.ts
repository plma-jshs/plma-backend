import { z } from 'zod';

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

export const dormReportCreateSchema = z.object({
  userId: z.coerce.number().int().min(1),
  roomId: z.coerce.number().int().min(1),
  description: z.string().trim().min(1).max(1000),
  imageUrl: z.string().trim().url().optional(),
  imageKey: z.string().trim().max(255).optional(),
});

export const dormReportUpdateSchema = z.object({
  description: z.string().trim().min(1).max(1000).optional(),
  imageUrl: z.string().trim().url().optional(),
  imageKey: z.string().trim().max(255).optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED']).optional(),
  comment: z.string().trim().max(500).optional(),
});

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
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED']),
  comment: z.string().nullable(),
  user: dormUserBriefSchema,
  room: dormRoomBriefSchema,
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
export const findReportsResponseSchema = z.array(dormReportResponseSchema);
export const updateReportResponseSchema = dormReportResponseSchema;

export type DormReportIdParams = z.infer<typeof dormReportIdParamSchema>;
export type DormAssignmentMemberInput = z.infer<typeof dormAssignmentMemberSchema>;
export type DormAssignmentRoomInput = z.infer<typeof dormAssignmentRoomSchema>;
export type DormAssignmentsUpsertInput = z.infer<typeof dormAssignmentsUpsertSchema>;
export type DormAssignmentsQuery = z.infer<typeof dormAssignmentsQuerySchema>;
export type DormReportCreateInput = z.infer<typeof dormReportCreateSchema>;
export type DormReportUpdateInput = z.infer<typeof dormReportUpdateSchema>;