import DayOfWeek from './DaysOfWeek';

export type DailySchedule = {
  openAt: number | null;
  closeAt: number | null;
};

type WorkingHours = Record<DayOfWeek, DailySchedule>;

export default WorkingHours;
