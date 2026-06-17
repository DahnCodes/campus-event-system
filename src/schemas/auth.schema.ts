import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "Full name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;