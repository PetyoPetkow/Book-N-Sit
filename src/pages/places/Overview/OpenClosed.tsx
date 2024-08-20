import { FC } from 'react';
import WorkingHours from '../../../global/models/WorkingHours';
import DayOfWeek from '../../../global/models/DaysOfWeek';
import { differenceInMinutes, isAfter, isBefore } from 'date-fns';

// const OpenClosed: FC<OpenClosedProps> = ({ workingHours }: OpenClosedProps) => {
//   const daysOfWeek: DayOfWeek[] = [
//     'sunday',
//     'monday',
//     'tuesday',
//     'wednesday',
//     'thursday',
//     'friday',
//     'saturday',
//   ];

//   const now = new Date();
//   const currentDayIndex = now.getDay();
//   const nextDayIndex = (currentDayIndex + 1) % 7;

//   const currentDayName = daysOfWeek[currentDayIndex];
//   const nextDayName = daysOfWeek[nextDayIndex];

//   const { openAt: openAtToday, closeAt: closeAtToday } = workingHours[currentDayName];
//   const openAtTomorrow = workingHours[nextDayName].openAt;

//   let willOpenToday, isOpen, willOpenTomorrow;

//   // if (openAtToday && closeAtToday && openAtTomorrow) {
//   //   const openAtDate = getDateFromTimeString(openAtToday);
//   //   const closeAtDate = getDateFromTimeString(closeAtToday);
//   //   const openAtNextDate = getDateFromTimeString(openAtTomorrow);

//   //   willOpenToday = isBefore(now, openAtDate);
//   //   isOpen = isBefore(now, closeAtDate) && isAfter(now, openAtDate);
//   //   willOpenTomorrow = isAfter(now, closeAtDate);

//   //   console.log(openAtDate, closeAtDate);

//   //   const closeAtString = `${closeAtDate.getHours()}:${closeAtDate.getMinutes().toString().padStart(2, '0')}`;
//   //   const openAtString = `${openAtDate.getHours()}:${openAtDate.getMinutes().toString().padStart(2, '0')}`;

//   //   const willOpenTomorrowAt = `${openAtNextDate.getHours()}:${openAtNextDate.getMinutes().toString().padStart(2, '0')}`;

//   //   return (
//   //     <div className="rounded-full flex items-center justify-center px-2">
//   //       {willOpenToday && (
//   //         <span className="text-red-500">
//   //           Closed<span className="text-black"> ⋅ Opens at {openAtString}</span>
//   //         </span>
//   //       )}
//   //       {isOpen && (
//   //         <span className="text-green-500">
//   //           Opened<span className="text-black"> ⋅ Closes at {closeAtString}</span>
//   //         </span>
//   //       )}
//   //       {willOpenTomorrow && (
//   //         <span className="text-red-500">
//   //           Closed<span className="text-black"> ⋅ Opens at {willOpenTomorrowAt}</span>
//   //         </span>
//   //       )}
//   //     </div>
//   //   );
//   // }

//   console.log(willOpenToday, isOpen, willOpenTomorrow);

//   // const diffInMinutes = differenceInMinutes(date2, date1);

//   // // Convert minutes to hours and minutes
//   // const hours = Math.floor(diffInMinutes / 60);
//   // const minutes = diffInMinutes % 60;

//   return <div>{isOpen && <span>Opened till </span>}</div>;
// };

interface OpenClosedProps {
  workingHours: WorkingHours;
}

//export default OpenClosed;
