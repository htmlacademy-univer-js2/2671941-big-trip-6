import {createElement} from '../render.js';

const FILTER_TYPES = ['everything', 'future', 'present', 'past'];

const upperFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const createFilterItem = (type) => `
  <div class="trip-filters__filter">
    <input
      id="filter-${type}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
    >
    <label
      class="trip-filters__filter-label"
      for="filter-${type}"
    >
      ${upperFirst(type)}
    </label>
  </div>
`;

const createTripFilterTemplate = () => `
  <form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${FILTER_TYPES.map(createFilterItem).join('')}
    <button class="visually-hidden" type="submit">
      Accept filter
    </button>
  </form>
`;

export default class TripFilterView {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    return createTripFilterTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}