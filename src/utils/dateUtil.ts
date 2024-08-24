import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

const getDateStringFromTimestamp = (timestamp: Timestamp) => {
  return new Date(timestamp.seconds * 1000).toDateString();
};

const getTimeFromNowFromTimestamp = (timestamp: Timestamp) => {
  return moment(new Date(timestamp.seconds * 1000)).fromNow();
};

export { getDateStringFromTimestamp, getTimeFromNowFromTimestamp };
