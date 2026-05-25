import EventCreationFormView from '../view/event-creation-form-view.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripSortView from '../view/trip-sort-view.js';
import { render, replace } from '../framework/render.js';

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
    this.#renderTripInfo();
    render(new TripFilterView(), this.#filtersContainer);
    render(new TripSortView(), this.#eventsContainer);

    const points = [...this.#pointsModel.getPoints()];

    if (points.length === 0) {
      const creationForm = new EventCreationFormView({
        allDestinations: this.#pointsModel.getDestinations()
      });
      render(creationForm, this.#eventsContainer);
      return;
    }

    points.forEach((point) => this.#renderTripPoint(point));
  }

  #renderTripInfo() {
    const tripControls = this.#tripMainContainer.querySelector('.trip-main__trip-controls');
    render(new TripInfoView(), tripControls, 'beforebegin');
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