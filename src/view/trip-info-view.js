import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTemplate = ({ title, dateFrom, dateTo, totalCost }) => {
  if (!title) {
    return '';
  }

  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>
  `;
};

export default class TripInfoView extends AbstractView {
  #title = '';
  #dateFrom = '';
  #dateTo = '';
  #totalCost = 0;

  constructor({ title = '', dateFrom = '', dateTo = '', totalCost = 0 } = {}) {
    super();
    this.#title = title;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripInfoTemplate({
      title: this.#title,
      dateFrom: this.#dateFrom,
      dateTo: this.#dateTo,
      totalCost: this.#totalCost
    });
  }
}
