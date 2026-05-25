import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';
import { NoPointsTextType } from '../const.js';

const createNoPointsTemplate = (filterType) => `
  <p class="trip-events__msg">${NoPointsTextType[filterType]}</p>
`;

export default class NoPointsView extends AbstractView {
  #filterType = FilterType.EVERYTHING;

  constructor({ filterType = FilterType.EVERYTHING } = {}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}