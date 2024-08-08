import { InputLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { FC, useEffect, useState } from 'react';
import DayOfWeek from '../../../../global/models/DaysOfWeek';
import WorkingHours from '../../../../global/models/WorkingHours';

const WorkigHoursDay: FC<WorkigHoursDayProps> = ({
  disabled,
  openAt,
  closeAt,
  dayOfWeek,
  onOpenAtChanged,
  onCloseAtChanged,
}) => {
  return (
    <div className="grid grid-cols-3 items-center">
      <InputLabel className="">{dayOfWeek}</InputLabel>
      <div className="flex gap-5 col-span-2">
        <TimePicker
          disabled={disabled}
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{ textField: { size: 'small' } }}
          value={openAt}
          onChange={onOpenAtChanged}
        />
        <TimePicker
          disabled={disabled}
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{ textField: { size: 'small' } }}
          value={closeAt}
          onChange={onCloseAtChanged}
        />
      </div>
    </div>
  );
};

interface WorkigHoursDayProps {
  disabled: boolean;
  dayOfWeek: DayOfWeek;
  openAt: Date | null;
  closeAt: Date | null;
  onOpenAtChanged: (date: Date | null) => void;
  onCloseAtChanged: (date: Date | null) => void;
}

export default WorkigHoursDay;
