import { z } from 'zod';

export const BaseSchema = z.object({
  id: z.string(),
});
