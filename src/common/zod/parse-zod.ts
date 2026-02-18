import { BadRequestException } from '@nestjs/common';
import { ZodType } from 'zod';

export function parseZod<T>(schema: ZodType<T>, data: unknown): T {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new BadRequestException(parsed.error.flatten());
  }

  return parsed.data;
}