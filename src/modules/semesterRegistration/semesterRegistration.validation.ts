import { z } from 'zod';
import { semesterRegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...semesterRegistrationStatus] as [string, ...string[]])
      .optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationValidationSchema,
};

