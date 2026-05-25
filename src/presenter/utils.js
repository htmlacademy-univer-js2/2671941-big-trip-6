import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const formatDate = (date, format) => (date ? dayjs(date).format(format) : '');

const formatEventDate = (date) => formatDate(date, 'DD/MM/YY HH:mm');
const formatEventDay = (date) => formatDate(date, 'DD');
const formatEventMonth = (date) => formatDate(date, 'MMM').toUpperCase();
const formatEventTime = (date) => formatDate(date, 'HH:mm');
const formatEventISODate = (date) => formatDate(date, 'YYYY-MM-DD');
const formatTripDate = (date) => formatDate(date, 'DD MMM').toUpperCase();

const formatEventDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }

  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const eventDuration = dayjs.duration(diff);

  const days = Math.floor(eventDuration.asDays());
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }

  return `${minutes}M`;
};

const upperFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const isFuturePoint = (point) => dayjs(point.dateFrom).isAfter(dayjs());
const isPresentPoint = (point) =>
  (dayjs(point.dateFrom).isBefore(dayjs()) || dayjs(point.dateFrom).isSame(dayjs())) &&
  (dayjs(point.dateTo).isAfter(dayjs()) || dayjs(point.dateTo).isSame(dayjs()));
const isPastPoint = (point) => dayjs(point.dateTo).isBefore(dayjs());

const countPointsByFilter = (points, filterFunction) => points.filter(filterFunction).length;

const countFuturePoints = (points) => countPointsByFilter(points, isFuturePoint);
const countPresentPoints = (points) => countPointsByFilter(points, isPresentPoint);
const countPastPoints = (points) => countPointsByFilter(points, isPastPoint);

const sortPointsByDate = (points) => [...points].sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));

const getDestinationNameByPoint = (point, destinations) => {
  const destination = destinations.find((item) => item.id === point.destination);
  return destination ? destination.name : '';
};

const getTripTitle = (points, destinations) => {
  if (!points.length) {
    return '';
  }

  const destinationNames = sortPointsByDate(points)
    .map((point) => getDestinationNameByPoint(point, destinations))
    .filter(Boolean);

  if (!destinationNames.length) {
    return '';
  }

  if (destinationNames.length <= 3) {
    return destinationNames.join(' &mdash; ');
  }

  return `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
};

const getTripDates = (points) => {
  if (!points.length) {
    return {
      dateFrom: '',
      dateTo: ''
    };
  }

  const sortedPoints = sortPointsByDate(points);

  return {
    dateFrom: formatTripDate(sortedPoints[0].dateFrom),
    dateTo: formatTripDate(sortedPoints[sortedPoints.length - 1].dateTo)
  };
};

const getTotalCost = (points, offers) => points.reduce((total, point) => {
  const offersByType = offers.find((item) => item.type === point.type);

  const selectedOffersCost = offersByType
    ? offersByType.offers
      .filter((offer) => point.offers.includes(offer.id))
      .reduce((sum, offer) => sum + offer.price, 0)
    : 0;

  return total + point.basePrice + selectedOffersCost;
}, 0);

export {
  upperFirst,
  formatEventDate,
  getRandomArrayElement,
  sortPointsByDate,
  formatTripDate,
  countFuturePoints,
  countPresentPoints,
  countPastPoints,
  getTripTitle,
  getTripDates,
  getTotalCost,
  formatEventDay,
  formatEventMonth,
  formatEventTime,
  formatEventDuration,
  formatEventISODate
};