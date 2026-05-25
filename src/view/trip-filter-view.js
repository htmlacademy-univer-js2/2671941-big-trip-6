import AbstractView from '../framework/view/abstract-view.js';
import { upperFirst } from '../utils.js';
import { FILTER_TYPES } from '../const.js';

const createFilterItem = (filterType, currentFilterType, filtersInfo) => {
  const isDisabled = filterType !== 'everything' && filtersInfo[filterType] === 0;

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${filterType}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterType}"
        ${filterType === currentFilterType ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${filterType}"
      >
        ${upperFirst(filterType)}
      </label>
    </div>
  `;
};

const createTripFilterTemplate = (filtersInfo, currentFilterType = 'everything') => `
  <form class="trip-filters" action="#" method="get">
    ${FILTER_TYPES.map((filterType) => createFilterItem(filterType, currentFilterType, filtersInfo)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class TripFilterView extends AbstractView {
  #currentFilterType = 'everything';
  #filtersInfo = {};

  constructor({ currentFilterType = 'everything', filtersInfo } = {}) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#filtersInfo = filtersInfo;
  }

  get template() {
    return createTripFilterTemplate(this.#filtersInfo, this.#currentFilterType);
  }
}