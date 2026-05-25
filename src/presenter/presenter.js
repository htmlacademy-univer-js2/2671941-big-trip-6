import TripInfoView from '../view/trip-info-view.js';
import TripSortView from '../view/trip-sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { render, remove} from '../framework/render.js';
import {
  sortPointsByDate,
  sortPointsByTime,
  sortPointsByPrice,
  getTripTitle,
  getTripDates,
  getTotalCost
} from '../utils.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';

export default class TripPresenter {
  #tripMainContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #noPointsComponent = null;
  #tripInfoComponent = null;

  #newEventButton = null;

  constructor({ tripMainContainer, eventsContainer, pointsModel, filterModel, newEventButton }) {
    this.#tripMainContainer = tripMainContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newEventButton = newEventButton;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);

    this.#newPointPresenter = new NewPointPresenter({
      eventsContainer: this.#eventsContainer,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleNewPointFormSubmit,
      onDestroy: this.#handleNewPointFormClose
    });
  }

  init() {
    const points = this.#getFilteredPoints();
    const destinations = this.#pointsModel.getDestinations();
    const offers = this.#pointsModel.getOffers();

    this.#renderTripInfo(points, destinations, offers);

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #getFilteredPoints() {
    const points = [...this.#pointsModel.getPoints()];
    const filterType = this.#filterModel.filter;
    const currentDate = new Date();

    switch (filterType) {
      case FilterType.FUTURE:
        return points.filter((point) => point.dateFrom > currentDate);

      case FilterType.PRESENT:
        return points.filter((point) =>
          point.dateFrom <= currentDate && point.dateTo >= currentDate
        );

      case FilterType.PAST:
        return points.filter((point) => point.dateTo < currentDate);

      case FilterType.EVERYTHING:
      default:
        return points;
    }
  }

  #getSortedPoints() {
    const points = this.#getFilteredPoints();

    switch (this.#currentSortType) {
      case SortType.TIME:
        return sortPointsByTime(points);
      case SortType.PRICE:
        return sortPointsByPrice(points);
      case SortType.DAY:
      default:
        return sortPointsByDate(points);
    }
  }

  #renderTripInfo(points, destinations, offers) {
    if (this.#tripInfoComponent !== null) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }

    if (!points.length) {
      return;
    }

    const tripControls = this.#tripMainContainer.querySelector('.trip-main__trip-controls');
    const tripDates = getTripDates(points);

    this.#tripInfoComponent = new TripInfoView({
      title: getTripTitle(points, destinations),
      dateFrom: tripDates.dateFrom,
      dateTo: tripDates.dateTo,
      totalCost: getTotalCost(points, offers)
    });

    render(this.#tripInfoComponent, tripControls, 'beforebegin');
  }

  #renderSort() {
    this.#sortComponent = new TripSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterModel.filter
    });

    render(this.#noPointsComponent, this.#eventsContainer);
  }

  #renderPoints() {
    const sortedPoints = this.#getSortedPoints();
    sortedPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventsContainer: this.#eventsContainer,
      pointsModel: this.#pointsModel,
      point,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearBoard() {
    this.#clearPoints();

    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#noPointsComponent !== null) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy?.());
    this.#pointPresenters.clear();
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).updatePoint(data);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#currentSortType = SortType.DAY;
        this.init();
        break;

      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#currentSortType = SortType.DAY;
        this.init();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderSort();
    this.#renderPoints();
  };

  #handleNewEventButtonClick = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;
    this.#handleModeChange();

    this.#newPointPresenter.init();
    this.#newEventButton.disabled = true;
  };

  #handleNewPointFormSubmit = (newPoint) => {
    this.#handleViewAction(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      newPoint
    );
  };

  #handleNewPointFormClose = () => {
    this.#newEventButton.disabled = false;
  };
}