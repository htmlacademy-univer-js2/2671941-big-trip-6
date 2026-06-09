import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const formatDate = (date, format) => (date ? dayjs(date).format(format) : '');

const formatEventDate = (date) => formatDate(date,'DD/MM/YY HH:mm');
const formatEventDay = (date) => formatDate(date, 'DD');
const formatEventMonth = (date) => formatDate(date, 'MMM').toUpperCase();
const formatEventTime = (date) => formatDate(date, 'HH:mm');
const formatEventISODate = (date) => formatDate(date, 'YYYY-MM-DD');
const formatTripDate = (date) => formatDate(date, 'DD MMM').toUpperCase();

const formatEventDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }

  const diff = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const days = Math.floor(diff / 1440);
  const hours = Math.floor((diff % 1440) / 60);
  const minutes = diff % 60;

  const format = (value) => String(value).padStart(2, '0');

  if (days > 0) {
    return `${format(days)}D ${format(hours)}H ${format(minutes)}M`;
  }

  if (hours > 0) {
    return `${format(hours)}H ${format(minutes)}M`;
  }

  return `${format(minutes)}M`;
};

export {
  formatEventDate,
  formatEventDay,
  formatEventMonth,
  formatEventTime,
  formatEventDuration,
  formatEventISODate,
  formatTripDate
};
