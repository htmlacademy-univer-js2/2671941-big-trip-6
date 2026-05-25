import { getRandomPoints } from '../mock/point.js';
import { mockDestinations } from '../mock/destination.js';
import { mockOffers } from '../mock/offer.js';

const POINT_COUNT = 5;

export default class PointsModel {
  points = getRandomPoints(POINT_COUNT);
  destinations = mockDestinations;
  offers = mockOffers;

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getDestinationsById(id) {
    if (!id) {
      return null;
    }
    const allDestinations = this.getDestinations();
    const destination = allDestinations.find((item) => item.id === id);
    return destination || null;
  }

  getOffersByType(type) {
    if (!type) {
      return null;
    }
    const allOffers = this.getOffers();
    const offersByType = allOffers.find((item) => item.type === type);
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

  updatePoint(updatedPoint) {
    this.points = this.points.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );
  }
}
