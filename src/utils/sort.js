import dayjs from 'dayjs';

const sortPointsByDate = (points) => [...points].sort((pointA, pointB) => {
  const dateDiff = dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

  if (dateDiff !== 0) {
    return dateDiff;
  }

  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  if (durationA !== durationB) {
    return durationB - durationA;
  }

  if (pointA.basePrice !== pointB.basePrice) {
    return pointB.basePrice - pointA.basePrice;
  }

  return String(pointA.id).localeCompare(String(pointB.id));
});

const sortPointsByTime = (points) => [...points].sort((pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
});

const sortPointsByPrice = (points) => [...points].sort((pointA, pointB) =>
  pointB.basePrice - pointA.basePrice
);

export {
  sortPointsByDate,
  sortPointsByTime,
  sortPointsByPrice
};