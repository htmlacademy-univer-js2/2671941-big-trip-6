import TripFilterView from '../view/trip-filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UpdateType, FilterType } from '../const.js';
import {
  countFuturePoints,
  countPresentPoints,
  countPastPoints,
} from '../utils/filter.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor({ filtersContainer, pointsModel, filterModel }) {
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const previousFilterComponent = this.#filterComponent;

    const points = this.#pointsModel.getPoints();

    const filtersInfo = this.#getFiltersInfo(points);

    this.#filterComponent = new TripFilterView({
      currentFilterType: this.#filterModel.filter,
      filtersInfo,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (previousFilterComponent === null) {
      render(this.#filterComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  }

  #getFiltersInfo(points) {
    return {
      [FilterType.EVERYTHING]: points.length,
      [FilterType.FUTURE]: countFuturePoints(points),
      [FilterType.PRESENT]: countPresentPoints(points),
      [FilterType.PAST]: countPastPoints(points),
    };
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
