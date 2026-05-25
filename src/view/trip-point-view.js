import { createElement } from '../render.js';
import {
  upperFirst,
  formatEventDay,
  formatEventMonth,
  formatEventTime,
  formatEventDuration,
  formatEventISODate
} from '../utils.js';

const createOfferItem = (offer) => `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>
`;

const createOffersList = (offers = []) => {
  if (!offers || offers.length === 0) {
    return '';
  }

  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.map(createOfferItem).join('')}
    </ul>
  `;
};

const createTripPointTemplate = (data = {}) => {
  const {
    point = {},
    destination = null,
    offers = []
  } = data;

  const {
    type = 'taxi',
    basePrice = 0,
    dateFrom = null,
    dateTo = null,
    isFavorite = false
  } = point;

  const destinationName = destination ? destination.name : '';
  const typeIcon = type ? type.toLowerCase() : 'taxi';
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  const displayOffers = offers.slice(0, 3);

  return `
  <li class="trip-events__item">
    <div class="event">

      <time class="event__date" datetime="${formatEventISODate(dateFrom)}">
        ${dateFrom ? `${formatEventMonth(dateFrom)} ${formatEventDay(dateFrom)}` : ''}
      </time>

      <div class="event__type">
        <img
          class="event__type-icon"
          width="42"
          height="42"
          src="img/icons/${typeIcon}.png"
          alt="Event type icon"
        >
      </div>

      <h3 class="event__title">
        ${upperFirst(type)} ${destinationName}
      </h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom || ''}">
            ${dateFrom ? formatEventTime(dateFrom) : ''}
          </time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo || ''}">
            ${dateTo ? formatEventTime(dateTo) : ''}
          </time>
        </p>
        <p class="event__duration">
          ${formatEventDuration(dateFrom, dateTo)}
        </p>
      </div>

      <p class="event__price">
        &euro;&nbsp;
        <span class="event__price-value">
          ${basePrice}
        </span>
      </p>

      ${createOffersList(displayOffers)}

      <button
        class="event__favorite-btn ${favoriteClass}"
        type="button"
      >
        <span class="visually-hidden">Add to favorite</span>
        <svg
          class="event__favorite-icon"
          width="28"
          height="28"
          viewBox="0 0 28 28"
        >
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>

      <button
        class="event__rollup-btn"
        type="button"
      >
        <span class="visually-hidden">Open event</span>
      </button>

    </div>
  </li>
`;
};

export default class TripPointView {
  constructor({
    point = {},
    destination = null,
    offers = []
  } = {}) {
    this.element = null;
    this.point = point;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createTripPointTemplate({
      point: this.point,
      destination: this.destination,
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