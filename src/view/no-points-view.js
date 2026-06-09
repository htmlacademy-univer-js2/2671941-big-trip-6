import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';
import { NoPointsTextType } from '../const.js';

const createNoPointsTemplate = (filterType, isLoadingError) => `
  <p class="trip-events__msg">
    ${isLoadingError
    ? 'Failed to load latest route information'
    : NoPointsTextType[filterType]}
  </p>
`;

export default class NoPointsView extends AbstractView {
  #filterType = FilterType.EVERYTHING;
  #isLoadingError = false;

  constructor({
    filterType = FilterType.EVERYTHING,
    isLoadingError = false
  } = {}) {
    super();

    this.#filterType = filterType;
    this.#isLoadingError = isLoadingError;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType, this.#isLoadingError);
  }
}
