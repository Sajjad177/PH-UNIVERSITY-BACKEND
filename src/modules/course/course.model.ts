import { model, Schema } from 'mongoose';
import { TCourse, TPreRequisiteCourse } from './course.interface';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse>({
  course: {
    type: Schema.Types.ObjectId,
    // ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  prefix: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: Number,
    required: true,
    trim: true,
  },
  credits: {
    type: Number,
    required: true,
    trim: true,
  },
  preRequisiteCourses: {
    type: [preRequisiteCourseSchema],
    // ref: 'Course',
  },
});

export const Course = model<TCourse>('Course', courseSchema);
