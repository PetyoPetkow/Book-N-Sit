import { InputLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { FC } from 'react';
import DayOfWeek from '../../../../global/models/DaysOfWeek';

const WorkigHoursDay: FC<WorkigHoursDayProps> = ({
  dayOfWeek,
  onOpenAtChanged,
  onCloseAtChanged,
}) => {
  return (
    <div className="grid grid-cols-3 items-center">
      <InputLabel className="">{dayOfWeek}</InputLabel>
      <div className="flex gap-5 col-span-2">
        <TimePicker
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{ textField: { size: 'small' } }}
          onChange={onOpenAtChanged}
        />
        <TimePicker
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{ textField: { size: 'small' } }}
          onChange={onCloseAtChanged}
        />
      </div>
    </div>
  );
};

interface WorkigHoursDayProps {
  dayOfWeek: DayOfWeek;
  onOpenAtChanged: (date: Date | null) => void;
  onCloseAtChanged: (date: Date | null) => void;
}

export default WorkigHoursDay;
