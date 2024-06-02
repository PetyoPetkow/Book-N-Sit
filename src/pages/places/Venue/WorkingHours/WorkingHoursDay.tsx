import { InputLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { FC } from 'react';

const WorkigHoursDay: FC<WorkigHoursDayProps> = ({ label }) => {
  return (
    <div className="grid grid-cols-3 items-center">
      <InputLabel className="">{label}</InputLabel>
      <div className="flex gap-5 col-span-2">
        <TimePicker
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{ textField: { size: 'small' } }}
        />
        <TimePicker
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{ textField: { size: 'small' } }}
        />
      </div>
    </div>
  );
};

interface WorkigHoursDayProps {
  label: string;
}

export default WorkigHoursDay;
