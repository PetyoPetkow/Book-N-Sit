import WorkigHoursDay from './WorkingHoursDay';
import { FC } from 'react';
import DayOfWeek from '../../../../global/models/DaysOfWeek';
import WorkingHours from '../../../../global/models/WorkingHours';

const WorkigHoursPicker: FC<WorkigHoursPickerProps> = ({
  disabled = false,
  workingHours,
  onOpenAtChanged,
  onCloseAtChanged,
}) => {
  const daysOfWeek: DayOfWeek[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  return (
    <div className="flex flex-col gap-2 m-auto">
      <div className="text-lg font-bold">Working hours</div>
      <div className="flex flex-col gap-3">
        {daysOfWeek.map((day) => {
          const openAtEpoch = workingHours[day].openAt;
          const openAt = openAtEpoch ? new Date(openAtEpoch) : null;
          const closeAtEpoch = workingHours[day].closeAt;
          const closeAt = closeAtEpoch ? new Date(closeAtEpoch) : null;

          return (
            <WorkigHoursDay
              disabled={disabled}
              openAt={openAt}
              closeAt={closeAt}
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
  disabled?: boolean;
  workingHours: WorkingHours;
  onOpenAtChanged: (dayOfWeek: DayOfWeek, date: Date | null) => void;
  onCloseAtChanged: (dayOfWeek: DayOfWeek, date: Date | null) => void;
}

export default WorkigHoursPicker;
