import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: {
        values: AcademicSemesterName,
        message: '{VALUE} is not a valid semester',
      },
    },
    code: {
      type: String,
      required: true,
      enum: {
        values: AcademicSemesterCode,
        message: '{VALUE} is not a valid code',
      },
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      required: true,
      enum: {
        values: Months,
        message: '{VALUE} is not a valid month',
      },
    },
    endMonth: {
      type: String,
      required: true,
      enum: {
        values: Months,
        message: '{VALUE} is not a valid month',
      },
    },
  },
  { timestamps: true },
);

// checking there is any semester with same name and year. Because semester in one year is only one semester by one name.

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemester.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExist) {
    throw new AppError('Semester already exists', StatusCodes.NOT_FOUND);
  }

  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
