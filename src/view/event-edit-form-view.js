import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { upperFirst, formatEventDate } from '../utils.js';
import { EVENT_TYPES } from '../const.js';

const createEventTypeItem = (type, currentType, isDisabled) => `
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${type === currentType ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label
      class="event__type-label event__type-label--${type}"
      for="event-type-${type}-1"
    >
      ${upperFirst(type)}
    </label>
  </div>
`;

const createEventTypeList = (currentType, isDisabled) => `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${EVENT_TYPES.map((type) => createEventTypeItem(type, currentType, isDisabled)).join('')}
    </fieldset>
  </div>
`;

const createTimeBlock = (dateFrom, dateTo, isDisabled) => `
  <div class="event__field-group event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input
      class="event__input event__input--time"
      id="event-start-time-1"
      type="text"
      name="event-start-time"
      value="${formatEventDate(dateFrom)}"
      ${isDisabled ? 'disabled' : ''}
      autocomplete="off"
      autocorrect="off"
    >
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input
      class="event__input event__input--time"
      id="event-end-time-1"
      type="text"
      name="event-end-time"
      value="${formatEventDate(dateTo)}"
      ${isDisabled ? 'disabled' : ''}
      autocomplete="off"
      autocorrect="off"
    >
  </div>
`;

const createOfferItem = (offer, isChecked = false, isDisabled = false) => `
  <div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="event-offer-${offer.id}"
      type="checkbox"
      name="event-offer"
      value="${offer.id}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>
`;

const createOffersSection = (offers = [], selectedOffers = [], isDisabled = false) => {
  if (!offers.length) {
    return '';
  }

  return `
  <section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">
      Offers
    </h3>
    <div class="event__available-offers">
      ${offers.map((offer) => createOfferItem(offer, selectedOffers.includes(offer.id), isDisabled)).join('')}
    </div>
  </section>
`;
};

const createDestinationSection = (destination) => {
  if (!destination) {
    return '';
  }

  const description = destination.description || '';
  const pictures = destination.pictures || [];

  const photosTape = pictures.map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description || 'Event photo'}">
  `).join('');

  return `
  <section class="event__section event__section--destination">
    <h3 class="event__section-title event__section-title--destination">
      Destination
    </h3>

    ${description ? `<p class="event__destination-description">${description}</p>` : ''}

    ${pictures.length > 0 ? `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosTape}
      </div>
    </div>
    ` : ''}
  </section>
`;
};

const createDestinationsList = (allDestinations = [], currentDestinationName) => {
  const options = allDestinations.map((dest) =>
    `<option value="${dest.name}" ${dest.name === currentDestinationName ? 'selected' : ''}></option>`
  ).join('');

  return `
  <datalist id="destination-list-1">
    ${options}
  </datalist>
`;
};

const getDestinationById = (allDestinations, destinationId) =>
  allDestinations.find((item) => item.id === destinationId) || null;

const getDestinationByName = (allDestinations, destinationName) =>
  allDestinations.find((item) => item.name === destinationName) || null;

const getOffersByType = (allOffers, type) =>
  allOffers.find((item) => item.type === type)?.offers || [];

const createEventEditFormTemplate = (state = {}, allDestinations = [], allOffers = [], isNewPoint = false) => {
  const {
    type = 'flight',
    basePrice = '',
    dateFrom = null,
    dateTo = null,
    offers: selectedOffers = [],
    destination: destinationId = null,
    isDisabled = false,
    isSaving = false,
    isDeleting = false,
  } = state;

  const destination = getDestinationById(allDestinations, destinationId);
  const destinationName = destination ? destination.name : '';
  const typeIcon = type.toLowerCase();
  const currentOffers = getOffersByType(allOffers, type);

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">

        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img
              class="event__type-icon"
              width="17"
              height="17"
              src="img/icons/${typeIcon}.png"
              alt="Event type icon"
            >
          </label>

          <input
            class="event__type-toggle visually-hidden"
            id="event-type-toggle-1"
            type="checkbox"
          >

          ${createEventTypeList(type, isDisabled)}
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${upperFirst(type)}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${destinationName}"
            ${isDisabled ? 'disabled' : ''}
            list="destination-list-1"
            autocomplete="off"
            autocorrect="off"
          >
          ${createDestinationsList(allDestinations, destinationName)}
        </div>

        ${createTimeBlock(dateFrom, dateTo, isDisabled)}

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input event__input--price"
            id="event-price-1"
            type="number"
            name="event-price"
            value="${basePrice}"
            ${isDisabled ? 'disabled' : ''}
            min="0"
            step="1"
            autocomplete="off"
            autocorrect="off"
          >
        </div>

        <button
          class="event__save-btn btn btn--blue"
          type="submit"
          ${isDisabled ? 'disabled' : ''}
        >
          ${isSaving ? 'Saving...' : 'Save'}
        </button>

        <button
          class="event__reset-btn"
          type="reset"
          ${isDisabled ? 'disabled' : ''}
        >
          ${isDeleting ? 'Deleting...' : (isNewPoint && 'Cancel') || 'Delete'}
        </button>

        ${isNewPoint ? '' : `
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
        `}

      </header>

      <section class="event__details">
        ${createOffersSection(currentOffers, selectedOffers, isDisabled)}
        ${createDestinationSection(destination)}
      </section>
    </form>
  </li>
`;
};

export default class EventEditFormView extends AbstractStatefulView {
  #allOffers = [];
  #allDestinations = [];
  #onFormSubmit = null;
  #onRollupClick = null;

  #startDatepicker = null;
  #endDatepicker = null;

  #onDeleteClick = null;

  #isNewPoint = false;

  constructor({
    point = {},
    offers = [],
    allDestinations = [],
    onFormSubmit = null,
    onRollupClick = null,
    onDeleteClick = null,
    isNewPoint = false
  } = {}) {
    super();

    this.#allOffers = offers;
    this.#allDestinations = allDestinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;
    this.#onDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;

    this._setState({
      ...point
    });

    this._restoreHandlers();
  }

  get template() {
    return createEventEditFormTemplate(
      this._state,
      this.#allDestinations,
      this.#allOffers,
      this.#isNewPoint
    );
  }

  _restoreHandlers() {
    const rollupButton = this.element.querySelector('.event__rollup-btn');

    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelectorAll('.event__offer-checkbox')
      .forEach((item) =>
        item.addEventListener('change', this.#offerChangeHandler));

    this.element
      .querySelectorAll('.event__type-input')
      .forEach((item) => item.addEventListener('change', this.#typeChangeHandler));

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    const startInput = this.element.querySelector('#event-start-time-1');
    const endInput = this.element.querySelector('#event-end-time-1');

    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
    }

    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
    }

    this.#startDatepicker = flatpickr(startInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,

      onChange: ([selectedDate]) => {
        this._state.dateFrom = selectedDate;

        this.#endDatepicker.set('minDate', selectedDate);
      }
    });

    this.#endDatepicker = flatpickr(endInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,

      onChange: ([selectedDate]) => {
        this._state.dateTo = selectedDate;

        if (selectedDate < this._state.dateFrom) {
          this.#endDatepicker.setDate(this._state.dateFrom);
          this._state.dateTo = this._state.dateFrom;
        }
      }
    });

    if (this._state.dateFrom) {
      this.#endDatepicker.set('minDate', this._state.dateFrom);
    }
  }

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.value;

    let updatedOffers = [...this._state.offers];

    if (evt.target.checked) {
      updatedOffers.push(offerId);
    } else {
      updatedOffers = updatedOffers.filter((id) => id !== offerId);
    }

    this.updateElement({
      offers: updatedOffers
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const selectedDestination = getDestinationByName(this.#allDestinations, evt.target.value);

    if (!selectedDestination) {
      return;
    }

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    const value = Number(evt.target.value);

    this._setState({
      basePrice: value < 0 ? 0 : value
    });
  };

  #priceInputHandler = (evt) => {
    evt.target.value = evt.target.value.replace(/\D/g, '');
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const priceInput = this.element.querySelector('.event__input--price');
    const price = Number(priceInput.value);
    const destinationInput = this.element.querySelector('.event__input--destination');
    const selectedDestination = getDestinationByName(this.#allDestinations, destinationInput.value);

    this.#onFormSubmit?.({
      ...this._state,
      destination: selectedDestination?.id || this._state.destination,
      basePrice: price < 0 ? 0 : price
    });
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick?.(this._state);
  };
}