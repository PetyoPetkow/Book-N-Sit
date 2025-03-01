import WorkigHoursDay from './WorkingHoursDay';
import { FC } from 'react';
import WorkingHours from '../../../models/WorkingHours';
import { DayOfWeek, DayOfWeekEnum } from '../../../models/DaysOfWeek';
import { useTranslation } from 'react-i18next';

const WorkigHoursPicker: FC<WorkigHoursPickerProps> = ({
  disabled = false,
  onValidityChange,
  workingHours,
  onOpenAtChanged,
  onCloseAtChanged,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 m-auto">
      <div className="text-lg font-bold">{t('label_venue_working_hours')}</div>
      <div className="flex flex-col gap-3">
        {Object.values(DayOfWeekEnum).map((day) => {
          if (workingHours[day] !== undefined) {
            const openAtEpoch = workingHours[day].openAt;
            const openAt = openAtEpoch ? new Date(openAtEpoch) : null;
            const closeAtEpoch = workingHours[day].closeAt;
            const closeAt = closeAtEpoch ? new Date(closeAtEpoch) : null;

            return (
              <WorkigHoursDay
                key={day}
                disabled={disabled}
                onValidityChange={onValidityChange}
                openAt={openAt}
                closeAt={closeAt}
                dayOfWeek={day}
                onOpenAtChanged={(date: Date | null) => onOpenAtChanged(day, date)}
                onCloseAtChanged={(date: Date | null) => onCloseAtChanged(day, date)}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

interface WorkigHoursPickerProps {
  disabled?: boolean;
  onValidityChange: (isValid: boolean) => void;
  workingHours: WorkingHours;
  onOpenAtChanged: (dayOfWeek: DayOfWeek, date: Date | null) => void;
  onCloseAtChanged: (dayOfWeek: DayOfWeek, date: Date | null) => void;
}

export default WorkigHoursPicker;
