import { z } from 'zod';

export const jokesResponseFormat = z.object({
  color: z.string(),
  mood: z.string(),
  // greetings: z.string(),
  // introduction: z.string(),
  jokes: z.array(z.string()),
});

export const moodResponseFormat = z.object({
  mood: z.string(),
});
