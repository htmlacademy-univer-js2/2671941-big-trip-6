import EventEditFormView from '../view/event-edit-form-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripSortView from '../view/trip-sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, replace } from '../framework/render.js';
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

  #currentEditForm = null;
  #currentPointComponent = null;
  #currentPoint = null;

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

    sortPointsByDate(points).forEach((point) => this.#renderTripPoint(point));
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

  #renderTripPoint(point) {
    const tripPointComponent = this.#createTripPointComponent(point);
    render(tripPointComponent, this.#eventsContainer);
  }

  #createTripPointComponent(point) {
    const destination = this.#pointsModel.getDestinationsById(point.destination);
    const offers = this.#pointsModel.getOffersById(point.type, point.offers) || [];

    const tripPointComponent = new TripPointView({
      point,
      destination,
      offers,
      onEditClick: () => this.#replacePointToEditForm(point, tripPointComponent)
    });

    return tripPointComponent;
  }

  #replacePointToEditForm(point, tripPointComponent) {
    if (this.#currentEditForm) {
      this.#replaceEditFormToPoint();
    }

    const destination = this.#pointsModel.getDestinationsById(point.destination);
    const offersByType = this.#pointsModel.getOffersByType(point.type);
    const allDestinations = this.#pointsModel.getDestinations();

    this.#currentEditForm = new EventEditFormView({
      point,
      offers: offersByType,
      destination,
      allDestinations,
      onFormSubmit: this.#replaceEditFormToPoint,
      onRollupClick: this.#replaceEditFormToPoint
    });

    this.#currentPoint = point;
    this.#currentPointComponent = tripPointComponent;

    replace(this.#currentEditForm, this.#currentPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditFormToPoint = () => {
    if (!this.#currentEditForm || !this.#currentPoint || !this.#currentPointComponent) {
      this.#removeGlobalHandlers();
      return;
    }

    const newTripPointComponent = this.#createTripPointComponent(this.#currentPoint);
    replace(newTripPointComponent, this.#currentEditForm);

    this.#currentEditForm = null;
    this.#currentPointComponent = null;
    this.#currentPoint = null;

    this.#removeGlobalHandlers();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
    }
  };

  #removeGlobalHandlers() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}