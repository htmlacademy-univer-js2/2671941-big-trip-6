import EventCreationFormView from '../view/event-creation-form-view.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripSortView from '../view/trip-sort-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  constructor({ headerContainer, eventsContainer, pointsModel }) {
    this.headerContainer = headerContainer;
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    render(new TripFilterView(), this.headerContainer);
    render(new TripSortView(), this.eventsContainer);

    const points = [...this.pointsModel.getPoints()];

    if (points.length === 0) {
      const creationForm = new EventCreationFormView({
        allDestinations: this.pointsModel.getDestinations()
      });
      render(creationForm, this.eventsContainer);
      return;
    }

    const firstPoint = points[0];
    const editForm = new EventEditFormView({
      point: firstPoint,
      offers: this.pointsModel.getOffersByType(firstPoint.type),
      destination: this.pointsModel.getDestinationsById(firstPoint.destination),
      allDestinations: this.pointsModel.getDestinations()
    });
    render(editForm, this.eventsContainer);

    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      const pointView = new TripPointView({
        point: point,
        offers: this.pointsModel.getOffersById(point.type, point.offers) || [],
        destination: this.pointsModel.getDestinationsById(point.destination)
      });
      render(pointView, this.eventsContainer);
    }
  }
}