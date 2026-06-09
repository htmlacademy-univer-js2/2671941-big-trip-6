import EventEditFormView from '../view/event-edit-form-view.js';
import { render, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/escape.js';

const BLANK_POINT = {
  id: crypto.randomUUID(),
  type: 'flight',
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  offers: [],
  isFavorite: false
};

export default class NewPointPresenter {
  #eventsContainer = null;
  #pointsModel = null;
  #onDataChange = null;
  #onDestroy = null;

  #newPointComponent = null;

  constructor({ eventsContainer, pointsModel, onDataChange, onDestroy }) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init(container) {
    if (this.#newPointComponent !== null) {
      return;
    }

    const allDestinations = this.#pointsModel.getDestinations();
    const allOffers = this.#pointsModel.getOffers();

    this.#newPointComponent = new EventEditFormView({
      point: { ...BLANK_POINT, id: crypto.randomUUID() },
      offers: allOffers,
      allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.destroy,
      onDeleteClick: this.destroy,
      isNewPoint: true
    });

    render(this.#newPointComponent, container, 'afterbegin');

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#newPointComponent === null) {
      return;
    }

    remove(this.#newPointComponent);
    this.#newPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#onDestroy();
  };

  setSaving() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setDeleting() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false
      });
    };

    this.#newPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (newPoint) => {
    this.#onDataChange(newPoint);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}