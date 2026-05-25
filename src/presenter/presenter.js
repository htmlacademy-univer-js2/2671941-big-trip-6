import EventCreationFormView from '../view/event-creation-form-view.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripSortView from '../view/trip-sort-view.js';
import { render } from '../render.js';

export class HeaderPresenter {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new TripFilterView(), this.container);
  }
}

export class MainPresenter {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new TripSortView(), this.container);
    render(new EventEditFormView(), this.container);
    render(new EventCreationFormView(), this.container);
    render(new TripPointView(), this.container);
    render(new TripPointView(), this.container);
    render(new TripPointView(), this.container);
  }
}