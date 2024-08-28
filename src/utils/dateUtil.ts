import { format } from 'date-fns';
import { bg } from 'date-fns/locale/bg';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

const getDateStringFromTimestamp = (timestamp: Timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return format(date, 'd MMM yyyy', { locale: bg });
};

const getTimeFromNowFromTimestamp = (timestamp: Timestamp) => {
  return moment(new Date(timestamp.seconds * 1000)).fromNow();
};

export { getDateStringFromTimestamp, getTimeFromNowFromTimestamp };
