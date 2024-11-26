import { z } from 'zod';

const userValidationSchema = z.object({
  id: z.string(),
  password: z
    .string()
    .min(6, { message: 'Password cannot be less than 6 characters' })
    .max(20, { message: 'Password cannot be more than 20 characters' }),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(['admin', 'student', 'faculty']),
  isDeleted: z.boolean().default(false),
  status: z.enum(['in-progress', 'blocked']).default('in-progress'),
});

export default userValidationSchema;
