import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { IPoint } from '@/common/interfaces/IPoint';

export const ViewPointResponseSchema = z.object({
  point: IPoint,
});

export class ViewPointResponseDto extends createZodDto(ViewPointResponseSchema) {}