import TripFilterView from '../view/trip-filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripSortView from '../view/trip-sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import {
  sortPointsByDate,
  sortPointsByTime,
  sortPointsByPrice,
  countFuturePoints,
  countPresentPoints,
  countPastPoints,
  getTripTitle,
  getTripDates,
  getTotalCost
} from '../utils.js';
import { SortType } from '../const.js';

export default class TripPresenter {
  #tripMainContainer = null;
  #filtersContainer = null;
  #eventsContainer = null;
  #pointsModel = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sortComponent = null;

  constructor({ tripMainContainer, filtersContainer, eventsContainer, pointsModel }) {
    this.#tripMainContainer = tripMainContainer;
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = [...this.#pointsModel.getPoints()];
    const destinations = this.#pointsModel.getDestinations();
    const offers = this.#pointsModel.getOffers();

    this.#renderTripInfo(points, destinations, offers);

    const filtersInfo = {
      everything: points.length,
      future: countFuturePoints(points),
      present: countPresentPoints(points),
      past: countPastPoints(points)
    };

    render(
      new TripFilterView({
        currentFilterType: 'everything',
        filtersInfo
      }),
      this.#filtersContainer
    );

    this.#renderSort();

    if (points.length === 0) {
      render(new NoPointsView(), this.#eventsContainer);
      return;
    }

    this.#renderPoints();
  }

  #getSortedPoints() {
    const points = [...this.#pointsModel.getPoints()];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return sortPointsByTime(points);
      case SortType.PRICE:
        return sortPointsByPrice(points);
      case SortType.DAY:
      default:
        return sortPointsByDate(points);
    }
  }

  #renderTripInfo(points, destinations, offers) {
    if (!points.length) {
      return;
    }

    const tripControls = this.#tripMainContainer.querySelector('.trip-main__trip-controls');

    const tripDates = getTripDates(points);

    render(
      new TripInfoView({
        title: getTripTitle(points, destinations),
        dateFrom: tripDates.dateFrom,
        dateTo: tripDates.dateTo,
        totalCost: getTotalCost(points, offers)
      }),
      tripControls,
      'beforebegin'
    );
  }

  #renderSort() {
    this.#sortComponent = new TripSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderPoints() {
    const sortedPoints = this.#getSortedPoints();
    sortedPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventsContainer: this.#eventsContainer,
      pointsModel: this.#pointsModel,
      point,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handlePointChange
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy?.());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);

    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    pointPresenter.updatePoint(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };
}
