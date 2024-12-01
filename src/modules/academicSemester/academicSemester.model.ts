import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constant';

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
      type: String  ,
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

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
