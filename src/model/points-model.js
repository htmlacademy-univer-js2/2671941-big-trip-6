import Observable from '../framework/observable.js';
import { getRandomPoints } from '../mock/point.js';
import { mockDestinations } from '../mock/destination.js';
import { mockOffers } from '../mock/offer.js';


const POINT_COUNT = 5;

export default class PointsModel extends Observable {
  #points = getRandomPoints(POINT_COUNT);
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
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

  setPoints(updateType, points) {
    this.#points = points;
    this._notify(updateType, points);
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points = [
      newPoint,
      ...this.#points,
    ];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, pointToDelete) {
    const index = this.#points.findIndex((point) => point.id === pointToDelete.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
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
}