import { FC } from 'react';
import WorkingHours from '../../../global/models/WorkingHours';
import DayOfWeek from '../../../global/models/DaysOfWeek';
import { differenceInMinutes, isAfter, isBefore } from 'date-fns';

const OpenClosed: FC<OpenClosedProps> = ({ workingHours }: OpenClosedProps) => {
  const getDateFromTimeString = (timeString: string): Date => {
    // Regular expression to match time and timezone offset
    const regex = /^(\d{2}:\d{2}:\d{2}) GMT([+-]\d{4})/;
    const match = timeString.match(regex);

    if (!match) {
      throw new Error('Invalid time string format');
    }

    // Extract time and timezone offset
    const [_, time, offset] = match;
    const offsetHours = parseInt(offset.substring(0, 3), 10);
    const offsetMinutes = parseInt(offset.substring(3), 10);

    // Use the current date as the base
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Create a full ISO 8601 date-time string
    const fullDateString = `${currentDate}T${time}${offset}`;

    // Create a new Date object using the combined string
    const newDate = new Date(fullDateString);

    // Validate if the newDate is valid
    if (isNaN(newDate.getTime())) {
      throw new Error('Invalid date created from time string');
    }

    return newDate;
  };

  const daysOfWeek: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const now = new Date();
  const currentDayIndex = now.getDay();
  const nextDayIndex = (currentDayIndex + 1) % 7;

  const currentDayName = daysOfWeek[currentDayIndex];
  const nextDayName = daysOfWeek[nextDayIndex];

  const { openAt: openAtToday, closeAt: closeAtToday } = workingHours[currentDayName];
  const openAtTomorrow = workingHours[nextDayName].openAt;

  let willOpenToday, isOpen, willOpenTomorrow;

  if (openAtToday && closeAtToday && openAtTomorrow) {
    const openAtDate = getDateFromTimeString(openAtToday);
    const closeAtDate = getDateFromTimeString(closeAtToday);
    const openAtNextDate = getDateFromTimeString(openAtTomorrow);

    willOpenToday = isBefore(now, openAtDate);
    isOpen = isBefore(now, closeAtDate) && isAfter(now, openAtDate);
    willOpenTomorrow = isAfter(now, closeAtDate);

    console.log(openAtDate, closeAtDate);

    const closeAtString = `${closeAtDate.getHours()}:${closeAtDate.getMinutes().toString().padStart(2, '0')}`;
    const openAtString = `${openAtDate.getHours()}:${openAtDate.getMinutes().toString().padStart(2, '0')}`;

    const willOpenTomorrowAt = `${openAtNextDate.getHours()}:${openAtNextDate.getMinutes().toString().padStart(2, '0')}`;

    return (
      <div className="rounded-full flex items-center justify-center px-2">
        {willOpenToday && (
          <span className="text-red-500">
            Closed<span className="text-black"> ⋅ Opens at {openAtString}</span>
          </span>
        )}
        {isOpen && (
          <span className="text-green-500">
            Opened<span className="text-black"> ⋅ Closes at {closeAtString}</span>
          </span>
        )}
        {willOpenTomorrow && (
          <span className="text-red-500">
            Closed<span className="text-black"> ⋅ Opens at {willOpenTomorrowAt}</span>
          </span>
        )}
      </div>
    );
  }

  console.log(willOpenToday, isOpen, willOpenTomorrow);

  // const diffInMinutes = differenceInMinutes(date2, date1);

  // // Convert minutes to hours and minutes
  // const hours = Math.floor(diffInMinutes / 60);
  // const minutes = diffInMinutes % 60;

  return <div>{isOpen && <span>Opened till </span>}</div>;
};

interface OpenClosedProps {
  workingHours: WorkingHours;
}

export default OpenClosed;
