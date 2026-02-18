import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(2).max(100),
    role: z.enum(['USER', 'ADMIN']).default('USER'),
    createdAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const validateUser = (data: unknown) => {
    return UserSchema.safeParse(data);
};
