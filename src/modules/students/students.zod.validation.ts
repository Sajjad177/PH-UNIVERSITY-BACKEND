// create validation with zod :
import { z } from 'zod';
import validator from 'validator';

const userNameValidationZodSchema = z.object({
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

const guardianValidationZodSchema = z.object({
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

const localGuardianValidationZodSchema = z.object({
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
    password: z.string().trim().nonempty('Password is required'),
    student: z.object({
      name: userNameValidationZodSchema,
      age: z.number().min(18, { message: 'Age must be at least 18' }),
      gender: z.enum(['male', 'female'], {
        message: 'Provided value is not a valid gender',
      }),

      dateOfBirth: z.date().optional(),
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
      guardian: guardianValidationZodSchema,
      localGuardian: localGuardianValidationZodSchema,
      profileImage: z.string().optional(),
    }),
  }),
});

export const StudentValidationZodSchema = {
  createStudentValidationSchema,
};
