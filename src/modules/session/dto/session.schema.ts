import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const sessionStudentSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  grade: z.number().int(),
  class: z.number().int(),
  num: z.number().int(),
  point: z.number().int(),
});

const sessionUserSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  studentId: z.number().int().nullable(),
  student: sessionStudentSchema.nullable(),
});

const baseSessionResponseSchema = z
  .object({
    isLogined: z.boolean(),
    iamId: z.number().int().nullable().optional(),
    userId: z.number().int().nullable().optional(),
    plmaId: z.number().int().nullable().optional(),
    stuid: z.number().int().nullable().optional(),
    name: z.string().nullable().optional(),
    jshsus: z.boolean().nullable().optional(),
  })
  .passthrough();

export const checkSessionResponseSchema = baseSessionResponseSchema;

export const getCurrentUserResponseSchema = baseSessionResponseSchema.extend({
  user: sessionUserSchema.nullable(),
});

export class CheckSessionResponseDto extends createZodDto(
  checkSessionResponseSchema,
) {}
export class GetCurrentUserResponseDto extends createZodDto(
  getCurrentUserResponseSchema,
) {}
