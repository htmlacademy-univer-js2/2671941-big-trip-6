import TripFilterView from '../view/trip-filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripSortView from '../view/trip-sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import {
  sortPointsByDate,
  countFuturePoints,
  countPresentPoints,
  countPastPoints,
  getTripTitle,
  getTripDates,
  getTotalCost
} from '../utils.js';

export default class TripPresenter {
  #tripMainContainer = null;
  #filtersContainer = null;
  #eventsContainer = null;
  #pointsModel = null;

  #pointPresenters = new Map();

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

    render(new TripSortView(), this.#eventsContainer);

    if (points.length === 0) {
      render(new NoPointsView(), this.#eventsContainer);
      return;
    }

    sortPointsByDate(points).forEach((point) => this.#renderPoint(point));
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

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);

    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    pointPresenter.updatePoint(updatedPoint);
  };
}
