import { z } from "zod";

export const emailSchema = z.string().email("Invalid email format");
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export const adminRegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: emailSchema,
  password:passwordSchema,
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password:passwordSchema,
});