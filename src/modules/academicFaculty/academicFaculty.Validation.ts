import { z } from 'zod';

const createAcademicFacultyZodSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be a string',
    }), 
  }),
});

export default createAcademicFacultyZodSchema;
