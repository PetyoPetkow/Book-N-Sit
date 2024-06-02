import { TimePicker } from '@mui/x-date-pickers';
import WorkigHoursDay from './WorkingHoursDay';
import { Button, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import clsx from 'clsx';

const WorkigHoursPicker = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="flex flex-col gap-2 m-auto">
      <div className="flex items-center gap-1">
        <div>Working hours</div>
        <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      <div className={clsx('flex flex-col gap-3', isOpen ? '' : 'hidden')}>
        {daysOfWeek.map((day) => {
          return <WorkigHoursDay label={day} />;
        })}
      </div>
    </div>
  );
};

export default WorkigHoursPicker;
