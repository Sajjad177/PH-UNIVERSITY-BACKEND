import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .min(6, { message: 'Password cannot be less than 6 characters' })
    .max(20, { message: 'Password cannot be more than 20 characters' })
    .optional(),
});

export default userValidationSchema;
