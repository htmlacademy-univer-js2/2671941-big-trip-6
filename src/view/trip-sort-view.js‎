import AbstractView from '../framework/view/abstract-view.js';
import { upperFirst } from '../utils.js';
import { SORT_TYPES } from '../const.js';

const createSortItem = (sortType, currentSortType, isDisabled = false) => `
  <div class="trip-sort__item trip-sort__item--${sortType}">
    <input
      id="sort-${sortType}"
      class="trip-sort__input visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${sortType}"
      ${sortType === currentSortType ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label
      class="trip-sort__btn"
      for="sort-${sortType}"
    >
      ${upperFirst(sortType)}
    </label>
  </div>
`;

const createTripSortTemplate = (currentSortType = 'day') => {
  const disabledSorts = {
    event: true,
    offer: true
  };

  return `
  <form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${SORT_TYPES.map((sortType) => createSortItem(sortType, currentSortType, disabledSorts[sortType])).join('')}
  </form>
`;
};

export default class TripSortView extends AbstractView {
  #currentSortType = 'day';

  constructor({ currentSortType = 'day' } = {}) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }
}