const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FILTER_TYPES = ['everything', 'future', 'present', 'past'];

const SORT_TYPES = ['day', 'event', 'time', 'price', 'offer'];

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

export {
  EVENT_TYPES,
  FILTER_TYPES,
  SORT_TYPES,
  SortType
};
