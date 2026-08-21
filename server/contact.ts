import { z } from "zod";

export const contactInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().email().max(320),
  message: z.string().trim().min(10).max(5000),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
