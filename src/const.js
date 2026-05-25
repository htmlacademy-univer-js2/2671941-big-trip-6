const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATION_ITEMS = [
  'Amsterdam', 'Geneva', 'Chamonix'
];

const DateFormat = {
  DATE: 'DD/MM/YY',
  TIME: 'HH:mm',
  FULL: 'DD/MM/YY HH:mm'
};

const FILTER_TYPES = ['everything', 'future', 'present', 'past'];

const SORT_TYPES = ['day', 'event', 'time', 'price', 'offer'];

export {
  EVENT_TYPES,
  DESTINATION_ITEMS,
  DateFormat,
  FILTER_TYPES,
  SORT_TYPES,
};