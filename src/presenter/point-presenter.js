import EventEditFormView from '../view/event-edit-form-view.js';
import TripPointView from '../view/trip-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointPresenter {
  #eventsContainer = null;
  #pointsModel = null;
  #point = null;
  #onModeChange = null;
  #onDataChange = null;

  #pointComponent = null;
  #editFormComponent = null;

  constructor({ eventsContainer, pointsModel, point, onModeChange, onDataChange }) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#point = point;
    this.#onModeChange = onModeChange;
    this.#onDataChange = onDataChange;
  }

  init() {
    this.#pointComponent = this.#createTripPointComponent();
    render(this.#pointComponent, this.#eventsContainer);
  }

  destroy() {
    if (this.#editFormComponent !== null) {
      remove(this.#editFormComponent);
      this.#editFormComponent = null;
    }

    if (this.#pointComponent !== null) {
      remove(this.#pointComponent);
      this.#pointComponent = null;
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#editFormComponent === null) {
      return;
    }

    this.#replaceEditFormToPoint();
  }

  updatePoint(point) {
    this.#point = point;

    const newPointComponent = this.#createTripPointComponent();

    if (this.#editFormComponent !== null) {
      replace(newPointComponent, this.#editFormComponent);
      this.#editFormComponent = null;
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    } else {
      replace(newPointComponent, this.#pointComponent);
    }

    this.#pointComponent = newPointComponent;
  }

  #createTripPointComponent() {
    const destination = this.#pointsModel.getDestinationsById(this.#point.destination);
    const offers = this.#pointsModel.getOffersById(this.#point.type, this.#point.offers) || [];

    return new TripPointView({
      point: this.#point,
      destination,
      offers,
      onEditClick: this.#replacePointToEditForm,
      onFavoriteClick: this.#favoriteClickHandler
    });
  }

  #createEditFormComponent() {
    const allDestinations = this.#pointsModel.getDestinations();
    const allOffers = this.#pointsModel.getOffers();

    return new EventEditFormView({
      point: this.#point,
      offers: allOffers,
      allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#replaceEditFormToPoint,
      onDeleteClick: this.#handleDeleteClick
    });
  }

  #handleFormSubmit = (updatedPoint) => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      updatedPoint
    );
  };

  #handleDeleteClick = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #replacePointToEditForm = () => {
    this.#onModeChange();

    this.#editFormComponent = this.#createEditFormComponent();
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceEditFormToPoint = () => {
    this.#pointComponent = this.#createTripPointComponent();
    replace(this.#pointComponent, this.#editFormComponent);
    this.#editFormComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #favoriteClickHandler = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      }
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
    }
  };
}
