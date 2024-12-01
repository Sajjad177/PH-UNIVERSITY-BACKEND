import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TacademicSemesterNameCode,
  TMonths,
} from './academicSemester.interface';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];

// dynamic semester code use in service:
export const academicSemesterNameCode: TacademicSemesterNameCode = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};