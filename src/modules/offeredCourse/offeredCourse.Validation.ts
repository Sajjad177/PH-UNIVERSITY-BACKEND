import z from 'zod';
import { Days } from './offeredCourse.constant';

// we cannot send academicSemester because we get it from semesterRegistration but we add it in interface for filtering :

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format expected HH:MM in 24 hour format',
        },
      ), // HH:MM 00-23 00-59
      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format expected HH:MM in 24 hour format',
        },
      ), // HH:MM 00-23 00-59
      days: z.array(z.enum([...Days] as [string, ...string[]])),
    })
    .refine(
      (body) => {
        // startTime : 10:30 format => 1970-01-01T10:30[year are same in start and end time but not compare it beacuse we compare only time]
        const startTime = new Date(`1970-01-01T${body.startTime}:00`);
        const endTime = new Date(`1970-01-01T${body.endTime}:00`);
        return startTime < endTime;
      },
      {
        message: 'Start time must be before end time',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    section: z.number().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    days: z.enum([...Days] as [string, ...string[]]).optional(),
  }),
});

export const OfferedCourseValidation = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
