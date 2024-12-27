import { z } from 'zod';
import validator from 'validator';

const createUserNameValidationZodSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'First name cannot be less than 3 characters' })
    .max(20, { message: 'First name cannot be more than 20 characters' })
    .refine(
      (value) => {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      { message: '{VALUE} is not a valid first name' },
    ),
  middleName: z.string().trim().max(20).optional(),
  lastName: z
    .string()
    .trim()
    .max(20, { message: 'Last name cannot be more than 20 characters' })
    .refine((value) => validator.isAlpha(value), {
      message: '{VALUE} is not a valid last name',
    }),
});

const createGuardianValidationZodSchema = z.object({
  fatherName: z.string().nonempty('Father name is required'),
  fatherContactNo: z
    .string()
    .trim()
    .nonempty('Father contact number is required'),
  fatherOccupation: z.string().trim().nonempty('Father occupation is required'),
  motherName: z.string().trim().nonempty('Mother name is required'),
  motherContactNo: z
    .string()
    .trim()
    .nonempty('Mother contact number is required'),
  motherOccupation: z.string().trim().nonempty('Mother occupation is required'),
});

const createLocalGuardianValidationZodSchema = z.object({
  name: z.string().nonempty('Local guardian name is required'),
  contactNo: z
    .string()
    .trim()
    .nonempty('Local guardian contact number is required'),
  occupation: z
    .string()
    .trim()
    .nonempty('Local guardian occupation is required'),
  address: z.string().trim().nonempty('Local guardian address is required'),
});

// Body use for validation of request body data
const createStudentValidationSchema = z.object({
  body: z.object({
    // user is ref from user model
    password: z.string().trim().optional(),
    student: z.object({
      name: createUserNameValidationZodSchema,
      gender: z.enum(['male', 'female'], {
        message: 'Provided value is not a valid gender',
      }),

      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .trim()
        .nonempty('Email is required')
        .email({ message: '{VALUE} is not a valid email' }),
      contactNo: z.string().trim().nonempty('Contact number is required'),
      emergencyContactNo: z
        .string()
        .trim()
        .nonempty('Emergency contact number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().trim().nonempty('Present address is required'),
      permanentAddress: z
        .string()
        .trim()
        .nonempty('Permanent address is required'),
      guardian: createGuardianValidationZodSchema,
      localGuardian: createLocalGuardianValidationZodSchema,
      // profileImage: z.string().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

// update validation --------------------

const updateUserNameValidationZodSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateGuardianValidationZodSchema = z.object({
  fatherName: z.string().min(1).max(20).optional(),
  fatherContactNo: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(1).max(20).optional(),
  motherContactNo: z.string().optional(),
  motherOccupation: z.string().optional(),
});

const updateLocalGuardianValidationZodSchema = z.object({
  name: z.string().min(1).max(20).optional(),
  contactNo: z.string().optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
});

const updateStudentValidationZodSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationZodSchema,
      gender: z.enum(['male', 'female']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
    }),
    guardian: updateGuardianValidationZodSchema.optional(),
    localGuardian: updateLocalGuardianValidationZodSchema.optional(),
    admissionSemester: z.string().optional(),
    academicDepartment: z.string().optional(),
  }),
});

export const StudentValidationZodSchema = {
  createStudentValidationSchema,
  updateStudentValidationZodSchema,
};
