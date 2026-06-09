import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

const NOT_FOUND_INDEX = -1;

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getPoints() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;

      this.#points = points.map(this.#adaptToClient);

      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];

      this._notify(UpdateType.INIT, { isError: true });
    }
  }

  setPoints(updateType, points) {
    this.#points = points;
    this._notify(updateType, points);
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === NOT_FOUND_INDEX) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(updatedPoint);
      const adaptedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        adaptedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, adaptedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, newPoint) {
    try {
      const response = await this.#pointsApiService.addPoint(newPoint);
      const adaptedPoint = this.#adaptToClient(response);

      this.#points = [adaptedPoint,...this.#points];

      this._notify(updateType, adaptedPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, pointToDelete) {
    const index = this.#points.findIndex((point) => point.id === pointToDelete.id);

    if (index === NOT_FOUND_INDEX) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(pointToDelete);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  getDestinationsById(id) {
    if (!id) {
      return null;
    }

    const destination = this.#destinations.find((item) => item.id === id);

    return destination || null;
  }

  getOffersByType(type) {
    if (!type) {
      return null;
    }

    const offersByType = this.#offers.find((item) => item.type === type);

    return offersByType || null;
  }

  getOffersById(type, itemsId) {
    if (!type || !itemsId || !Array.isArray(itemsId) || itemsId.length === 0) {
      return [];
    }

    const offersType = this.getOffersByType(type);

    if (!offersType || !offersType.offers) {
      return [];
    }

    return offersType.offers.filter((item) => itemsId.includes(item.id));
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}