import { sortPointsByDate } from './sort.js';
import { formatTripDate } from './date.js';

const getDestinationNameByPoint = (point, destinations) => {
  const destination = destinations.find((item) => item.id === point.destination);
  return destination?.name || '';
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
    return { dateFrom: '', dateTo: '' };
  }

  const sortedPoints = sortPointsByDate(points);

  return {
    dateFrom: formatTripDate(sortedPoints[0].dateFrom),
    dateTo: formatTripDate(sortedPoints[sortedPoints.length - 1].dateTo)
  };
};

const getTotalCost = (points, offers) => points.reduce((total, point) => {
  const offersByType = offers.find((item) => item.type === point.type);

  const selectedOffersCost = offersByType?.offers
    .filter((offer) => point.offers.includes(offer.id))
    .reduce((sum, offer) => sum + offer.price, 0) || 0;

  return total + point.basePrice + selectedOffersCost;
}, 0);

export {
  getTripTitle,
  getTripDates,
  getTotalCost
};