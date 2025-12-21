import { z } from 'zod';

export const adminLoginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});
export type AdminLoginData = z.infer<typeof adminLoginSchema>;