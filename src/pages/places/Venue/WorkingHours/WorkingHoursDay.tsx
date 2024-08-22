import { FormControl, IconButton, InputLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { FC, useEffect, useState } from 'react';
import DayOfWeek from '../../../../global/models/DaysOfWeek';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const WorkigHoursDay: FC<WorkigHoursDayProps> = ({
  disabled,
  onValidityChange,
  openAt,
  closeAt,
  dayOfWeek,
  onOpenAtChanged,
  onCloseAtChanged,
}) => {
  const [openAtError, setOpenAtError] = useState<boolean>(false);
  const [closeAtError, setCloseAtError] = useState<boolean>(false);

  useEffect(() => {
    console.log(openAtError);
  }, [openAtError]);

  useEffect(() => {
    if ((openAt !== null && closeAt !== null) || (openAt === null && closeAt === null)) {
      onValidityChange(true);
      setOpenAtError(false);
      setCloseAtError(false);
    } else {
      onValidityChange(false);
      if (openAt === null) {
        setOpenAtError(true);
      } else if (closeAt === null) {
        setCloseAtError(true);
      }
    }
  }, [openAt, closeAt]);

  return (
    <div className="grid grid-cols-3 items-center">
      <InputLabel>{dayOfWeek}</InputLabel>
      <div className="flex gap-5 col-span-2">
        <TimePicker
          disabled={disabled}
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{
            textField: {
              size: 'small',
              error: openAtError,
              helperText: openAtError && 'Either add "from time" or delete "to time"',
            },
          }}
          value={openAt}
          onChange={onOpenAtChanged}
        />

        <TimePicker
          disabled={disabled}
          className="flex-1"
          views={['hours', 'minutes']}
          slotProps={{
            textField: {
              size: 'small',
              error: closeAtError,
              helperText: closeAtError && 'Either add "to time" or delete "from time"',
            },
          }}
          value={closeAt}
          onChange={onCloseAtChanged}
        />

        <div>
          <IconButton
            onClick={() => {
              onOpenAtChanged(null);
              onCloseAtChanged(null);
            }}
          >
            <HighlightOffIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

interface WorkigHoursDayProps {
  disabled: boolean;
  onValidityChange: (isValid: boolean) => void;
  dayOfWeek: DayOfWeek;
  openAt: Date | null;
  closeAt: Date | null;
  onOpenAtChanged: (date: Date | null) => void;
  onCloseAtChanged: (date: Date | null) => void;
}

export default WorkigHoursDay;
