import { z } from 'zod';

export const responseFormat = z.object({
  mood: z.string(),
  color: z.string(),
  // greetings: z.string(),
  // introduction: z.string(),
  jokes: z.array(z.string()),
});
