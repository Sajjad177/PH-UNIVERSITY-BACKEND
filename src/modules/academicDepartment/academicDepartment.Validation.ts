import z from 'zod';

const createAcademicDepartmentSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department name must be a string',
      required_error: 'Academic department name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic faculty must be a string',
      required_error: 'Academic faculty is required',
    }),
  }),
});

const updateAcademicDepartmentSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic department name must be a string',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic faculty must be a string',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentSchema,
  updateAcademicDepartmentSchema,
};
