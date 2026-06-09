import dayjs from 'dayjs';

const isFuturePoint = (point) => dayjs(point.dateFrom).isAfter(dayjs());
const isPresentPoint = (point) =>
  (dayjs(point.dateFrom).isBefore(dayjs()) || dayjs(point.dateFrom).isSame(dayjs())) &&
  (dayjs(point.dateTo).isAfter(dayjs()) || dayjs(point.dateTo).isSame(dayjs()));
const isPastPoint = (point) => dayjs(point.dateTo).isBefore(dayjs());

const filterPoints = (points, filterFunction) => points.filter(filterFunction).length;

const countFuturePoints = (points) => filterPoints(points, isFuturePoint);
const countPresentPoints = (points) => filterPoints(points, isPresentPoint);
const countPastPoints = (points) => filterPoints(points, isPastPoint);

export {
  isFuturePoint,
  isPresentPoint,
  isPastPoint,
  countFuturePoints,
  countPresentPoints,
  countPastPoints
};
