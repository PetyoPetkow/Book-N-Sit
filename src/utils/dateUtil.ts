import { format, formatDistanceToNow, Locale } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

const getDateStringFromTimestamp = (timestamp: Timestamp, locale?: Locale) => {
  const date = new Date(timestamp.seconds * 1000);
  return format(date, 'd MMM yyyy', { locale: locale });
};

const getTimeFromNowFromTimestamp = (timestamp: Timestamp, locale?: Locale) => {
  return formatDistanceToNow(new Date(timestamp.seconds * 1000), {
    addSuffix: true,
    locale: locale,
  });
};

export { getDateStringFromTimestamp, getTimeFromNowFromTimestamp };
