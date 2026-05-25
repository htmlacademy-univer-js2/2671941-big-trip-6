import AbstractView from '../framework/view/abstract-view.js';
import { upperFirst } from '../utils.js';
import { SORT_TYPES, SortType } from '../const.js';

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
      data-sort-type="${sortType}"
    >
      ${upperFirst(sortType)}
    </label>
  </div>
`;

const createTripSortTemplate = (currentSortType = SortType.DAY) => {
  const disabledSorts = {
    [SortType.EVENT]: true,
    [SortType.OFFER]: true
  };

  return `
  <form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${SORT_TYPES.map((sortType) => createSortItem(sortType, currentSortType, disabledSorts[sortType])).join('')}
  </form>
`;
};

export default class TripSortView extends AbstractView {
  #currentSortType = SortType.DAY;
  #handleSortTypeChange = null;

  constructor({ currentSortType = SortType.DAY, onSortTypeChange } = {}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.querySelectorAll('.trip-sort__btn').forEach((button) => {
      if (button.hasAttribute('data-sort-type')) {
        button.addEventListener('click', this.#sortTypeChangeHandler);
      }
    });
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    const sortType = evt.currentTarget.dataset.sortType;
    this.#handleSortTypeChange?.(sortType);
  };
}
