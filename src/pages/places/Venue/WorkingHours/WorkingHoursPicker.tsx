import WorkigHoursDay from './WorkingHoursDay';
import { FC } from 'react';
import DayOfWeek from '../../../../global/models/DaysOfWeek';

const WorkigHoursPicker: FC<WorkigHoursPickerProps> = ({ onOpenAtChanged, onCloseAtChanged }) => {
  const daysOfWeek: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div className="flex flex-col gap-2 m-auto">
      <div className="text-lg font-bold">Working hours</div>
      <div className="flex flex-col gap-3">
        {daysOfWeek.map((day) => {
          return (
            <WorkigHoursDay
              dayOfWeek={day}
              onOpenAtChanged={(date: Date | null) => onOpenAtChanged(day, date)}
              onCloseAtChanged={(date: Date | null) => onCloseAtChanged(day, date)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface WorkigHoursPickerProps {
  onOpenAtChanged: (dayOfWeek: DayOfWeek, date: Date | null) => void;
  onCloseAtChanged: (dayOfWeek: DayOfWeek, date: Date | null) => void;
}

export default WorkigHoursPicker;
