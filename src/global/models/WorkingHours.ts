import DayOfWeek from './DaysOfWeek';

export type DailySchedule = {
  openAt: string | null;
  closeAt: string | null;
};

type WorkingHours = Record<DayOfWeek, DailySchedule>;

export default WorkingHours;
