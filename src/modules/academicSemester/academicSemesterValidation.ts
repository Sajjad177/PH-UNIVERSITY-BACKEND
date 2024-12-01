// academicSemesterValidation.ts
import z from 'zod';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum(AcademicSemesterName as [string, ...string[]]),
    code: z.enum(AcademicSemesterCode as [string, ...string[]]),
    year: z.string(),
    startMonth: z.enum(Months as [string, ...string[]]),
    endMonth: z.enum(Months as [string, ...string[]]),
  }),
});

export const academicSemesterValidation = {
  createAcademicSemesterValidationSchema,
};
