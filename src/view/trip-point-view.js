import AbstractView from '../framework/view/abstract-view.js';
import { upperFirst } from '../utils/common.js';
import {
  formatEventDay,
  formatEventMonth,
  formatEventTime,
  formatEventDuration,
  formatEventISODate,
} from '../utils/date.js';

function createPointTemplate(point, destination, typeOffers) {
  const {
    type = 'taxi',
    basePrice = 0,
    dateFrom = null,
    dateTo = null,
    offers: selectedOfferIds = [],
    isFavorite = false,
  } = point;

  const dateFormatted = dateFrom
    ? `${formatEventMonth(dateFrom)} ${formatEventDay(dateFrom)}`
    : '';
  const dateTimeFrom = formatEventISODate(dateFrom);
  const dateTimeTo = formatEventISODate(dateTo);
  const timeFrom = dateFrom ? formatEventTime(dateFrom) : '';
  const timeTo = dateTo ? formatEventTime(dateTo) : '';
  const duration = formatEventDuration(dateFrom, dateTo);

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const destinationName = destination ? destination.name : '';

  const selectedOffers = typeOffers.filter((offer) =>
    selectedOfferIds.includes(offer.id),
  );
  const offersTemplate =
    selectedOffers.length > 0
      ? `
    <h4 class='visually-hidden'>Offers:</h4>
    <ul class='event__selected-offers'>
      ${selectedOffers.map(
    (offer) => `
        <li class='event__offer'>
          <span class='event__offer-title'>${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class='event__offer-price'>${offer.price}</span>
        </li>
      `,
  )
    .join('')}
    </ul>
  `
      : '';

  return `
    <li class='trip-events__item'>
      <div class='event'>
        <time class='event__date' datetime='${dateTimeFrom}'>${dateFormatted}</time>
        <div class='event__type'>
          <img class='event__type-icon' width='42' height='42' src='img/icons/${type.toLowerCase()}.png' alt='Event type icon'>
        </div>
        <h3 class='event__title'>${upperFirst(type)} ${destinationName}</h3>
        <div class='event__schedule'>
          <p class='event__time'>
            <time class='event__start-time' datetime='${dateTimeFrom}'>${timeFrom}</time>
            &mdash;
            <time class='event__end-time' datetime='${dateTimeTo}'>${timeTo}</time>
          </p>
          <p class='event__duration'>${duration}</p>
        </div>
        <p class='event__price'>
          &euro;&nbsp;<span class='event__price-value'>${basePrice}</span>
        </p>
        ${offersTemplate}
        <button class='event__favorite-btn ${favoriteClass}' type='button'>
          <span class='visually-hidden'>Add to favorite</span>
          <svg class='event__favorite-icon' width='28' height='28' viewBox='0 0 28 28'>
            <path d='M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z'/>
          </svg>
        </button>
        <button class='event__rollup-btn' type='button'>
          <span class='visually-hidden'>Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class TripPointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, destination, offers, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    const typeOffers = this.#offers || [];
    return createPointTemplate(this.#point, this.#destination, typeOffers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick?.();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick?.();
  };
}
