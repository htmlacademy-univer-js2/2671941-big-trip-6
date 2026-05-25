import {createElement} from '../render.js';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const OFFER_TYPES = [
  {type: 'luggage', title: 'Add luggage', price: 50},
  {type: 'comfort', title: 'Switch to comfort', price: 80},
  {type: 'meal', title: 'Add meal', price: 15},
  {type: 'seats', title: 'Choose seats', price: 5},
  {type: 'train', title: 'Travel by train', price: 40}
];

const upperFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const createEventTypeItem = (type) => `
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
    >
    <label
      class="event__type-label event__type-label--${type}"
      for="event-type-${type}-1"
    >
      ${upperFirst(type)}
    </label>
  </div>
`;

const createEventTypeList = () => `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${EVENT_TYPES.map(createEventTypeItem).join('')}
    </fieldset>
  </div>
`;

const createTimeBlock = () => `
  <div class="event__field-group event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input
      class="event__input event__input--time"
      id="event-start-time-1"
      type="text"
      name="event-start-time"
      value="19/03/19 00:00"
    >
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input
      class="event__input event__input--time"
      id="event-end-time-1"
      type="text"
      name="event-end-time"
      value="19/03/19 00:00"
    >
  </div>
`;

const createOfferItem = ({type, title, price}) => `
  <div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="event-offer-${type}-1"
      type="checkbox"
      name="event-offer-${type}"
      checked
    >
    <label class="event__offer-label" for="event-offer-${type}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createOffersSection = () => `
  <div class="event__available-offers">
    ${OFFER_TYPES.map(createOfferItem).join('')}
  </div>
`;

const createEventEditFormTemplate = () => `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">

      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img
            class="event__type-icon"
            width="17"
            height="17"
            src="img/icons/flight.png"
            alt="Event type icon"
          >
        </label>

        <input
          class="event__type-toggle visually-hidden"
          id="event-type-toggle-1"
          type="checkbox"
        >

        ${createEventTypeList()}
      </div>

      <div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-1">
          Flight
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="Geneva"
          list="destination-list-1"
        >
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      ${createTimeBlock()}

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
          value="160"
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

      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">
          Offers
        </h3>
        ${createOffersSection()}
      </section>

      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">
          Destination
        </h3>

        <p class="event__destination-description">
          Chamonix-Mont-Blanc is a resort area near the junction of France,
          Switzerland and Italy. At the base of Mont Blanc, the highest summit
          in the Alps, it's renowned for its skiing.
        </p>

      </section>

    </section>
  </form>
`;

export default class EventEditFormView {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    return createEventEditFormTemplate();
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