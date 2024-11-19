import { model, Schema } from 'mongoose';
import validator from 'validator';

import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './students.interface';

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required'],
    maxLength: [20, 'First name cannot be more than 20 characters'],
    minLength: [3, 'First name cannot be less than 3 characters'],
    //! Custom validation for first name
    validate: function (value: string) {
      const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
      return firstNameStr === value;
    },
    message: '{VALUE} is not a valid first name',
  },
  middleName: { type: String, trim: true, maxLength: 20 },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required'],
    maxLength: [20, 'Last name cannot be more than 20 characters'],
    //! Custom validation for last name
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not a valid last name',
    },
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: [true, 'Father name is required'] },
  fatherContactNo: {
    type: String,
    trim: true,
    required: [true, 'Father contact number is required'],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Father occupation is required'],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, 'Mother name is required'],
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: [true, 'Mother contact number is required'],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Mother occupation is required'],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: [true, 'Local guardian name is required'] },
  contactNo: {
    type: String,
    trim: true,
    required: [true, 'Local guardian contact number is required'],
  },
  occupation: {
    type: String,
    trim: true,
    required: [true, 'Local guardian occupation is required'],
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Local guardian address is required'],
  },
});

const studentSchema = new Schema<Student>(
  {
    id: { type: String, required: true, unique: true },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: 'Provided value is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email',
      },
    },
    contactNo: {
      type: String,
      trim: true,
      required: [true, 'Contact number is required'],
      unique: true,
    },
    emergencyContactNo: {
      type: String,
      trim: true,
      required: [true, 'Emergency contact number is required'],
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      trim: true,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      trim: true,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian is required'],
    },
    profileImage: { type: String },
    isActive: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

export const StudentModel = model<Student>('Student', studentSchema);
