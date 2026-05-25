import { createElement } from '../render.js';
import { upperFirst, formatEventDate } from '../utils.js';
import { EVENT_TYPES } from '../const.js';

const createEventTypeItem = (type, currentType) => `
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${type === currentType ? 'checked' : ''}
    >
    <label
      class="event__type-label event__type-label--${type}"
      for="event-type-${type}-1"
    >
      ${upperFirst(type)}
    </label>
  </div>
`;

const createEventTypeList = (currentType) => `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${EVENT_TYPES.map((type) => createEventTypeItem(type, currentType)).join('')}
    </fieldset>
  </div>
`;

const createTimeBlock = (dateFrom, dateTo) => `
  <div class="event__field-group event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input
      class="event__input event__input--time"
      id="event-start-time-1"
      type="text"
      name="event-start-time"
      value="${formatEventDate(dateFrom)}"
    >
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input
      class="event__input event__input--time"
      id="event-end-time-1"
      type="text"
      name="event-end-time"
      value="${formatEventDate(dateTo)}"
    >
  </div>
`;

const createOfferItem = (offer, isChecked = false) => `
  <div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="event-offer-${offer.id}"
      type="checkbox"
      name="event-offer"
      value="${offer.id}"
      ${isChecked ? 'checked' : ''}
    >
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>
`;

const createOffersSection = (offers = [], selectedOffers = []) => {
  if (!offers || offers.length === 0) {
    return '';
  }

  return `
  <section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">
      Offers
    </h3>
    <div class="event__available-offers">
      ${offers.map((offer) => createOfferItem(offer, selectedOffers.includes(offer.id))).join('')}
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

const createEventEditFormTemplate = (data = {}) => {
  const {
    point = {},
    destination = null,
    allDestinations = [],
    offers = []
  } = data;

  const {
    type = 'flight',
    basePrice = '',
    dateFrom = null,
    dateTo = null,
    offers: selectedOffers = []
  } = point;

  const destinationName = destination ? destination.name : '';
  const typeIcon = type ? type.toLowerCase() : 'flight';

  return `
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

        ${createEventTypeList(type)}
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
          list="destination-list-1"
        >
        ${createDestinationsList(allDestinations, destinationName)}
      </div>

      ${createTimeBlock(dateFrom, dateTo)}

      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
          class="event__input event__input--price"
          id="event-price-1"
          type="text"
          name="event-price"
          value="${basePrice}"
        >
      </div>

      <button class="event__save-btn btn btn--blue" type="submit">
        Save
      </button>

      <button class="event__reset-btn" type="reset">
        Delete
      </button>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>

    </header>

    <section class="event__details">
      ${createOffersSection(offers?.offers, selectedOffers)}
      ${createDestinationSection(destination)}
    </section>
  </form>
`;
};

export default class EventEditFormView {
  constructor({
    point = {},
    offers = null,
    destination = null,
    allDestinations = []
  } = {}) {
    this.element = null;
    this.point = point;
    this.offers = offers;
    this.destination = destination;
    this.allDestinations = allDestinations;
  }

  getTemplate() {
    return createEventEditFormTemplate({
      point: this.point,
      destination: this.destination,
      allDestinations: this.allDestinations,
      offers: this.offers
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}