
import { TSchedule } from './offeredCourse.interface';

// dynamic way to handel this time conflict because when we update then same thing will happen :
//* 1 teacher can't have two class at the same day but he can have two class at the different day and time ------------------ ->
export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}:00`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}:00`);

    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}:00`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}:00`);

    // if newStartime is smaller then existingEndTime and newEndTime is greater then existingStartTime then throw an error :
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};
