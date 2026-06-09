import TripInfoView from '../view/trip-info-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { render, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {
  sortPointsByDate,
  sortPointsByTime,
  sortPointsByPrice,
} from '../utils/sort.js';
import {
  getTripTitle,
  getTripDates,
  getTotalCost
} from '../utils/trip-info.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';


const TimeLimit = {
  LOWER_LIMIT: 0,
  UPPER_LIMIT: 1000,
};

const RESET_SORT_TYPE = SortType.DAY;

export default class TripPresenter {
  #tripMainContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = RESET_SORT_TYPE;
  #sortComponent = null;
  #noPointsComponent = null;
  #tripInfoComponent = null;
  #eventListComponent = null;

  #newEventButton = null;

  #loadingComponent = new LoadingView();
  #isLoading = true;
  #isLoadingError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.#getFilteredPoints();
    const destinations = this.#pointsModel.getDestinations();
    const offers = this.#pointsModel.getOffers();

    this.#renderTripInfo(
      this.#pointsModel.getPoints(),
      destinations,
      offers
    );

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

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer);
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
      filterType: this.#filterModel.filter,
      isLoadingError: this.#isLoadingError
    });

    render(this.#noPointsComponent, this.#eventsContainer);
  }

  #renderEventList() {
    this.#eventListComponent = new EventListView();
    render(this.#eventListComponent, this.#eventsContainer);
  }

  #renderPoints() {
    this.#renderEventList();

    const sortedPoints = this.#getSortedPoints();
    sortedPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventsContainer: this.#eventListComponent.element,
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

    if (this.#loadingComponent !== null) {
      remove(this.#loadingComponent);
    }

    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#noPointsComponent !== null) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    if (this.#eventListComponent !== null) {
      remove(this.#eventListComponent);
      this.#eventListComponent = null;
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

        this.#renderTripInfo(
          this.#pointsModel.getPoints(),
          this.#pointsModel.getDestinations(),
          this.#pointsModel.getOffers()
        );
        break;

      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#currentSortType = RESET_SORT_TYPE;
        this.init();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isLoadingError = data?.isError || false;
        this.#clearBoard();
        this.init();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#newEventButton.disabled = false;

    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    const pointPresenter = this.#pointPresenters.get(update.id);
    const isFavoriteAction =
      actionType === UserAction.UPDATE_POINT &&
      pointPresenter &&
      !pointPresenter.isEditFormOpen();

    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        if (!isFavoriteAction) {
          pointPresenter.setSaving();
        }

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          if (!isFavoriteAction) {
            pointPresenter.setAborting();
          }
        } finally {
          this.#uiBlocker.unblock();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch(err) {
          this.#newPointPresenter.setAborting();
        } finally {
          this.#uiBlocker.unblock();
        }
        break;

      case UserAction.DELETE_POINT:
        pointPresenter.setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          pointPresenter.setAborting();
        } finally {
          this.#uiBlocker.unblock();
        }
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
    this.#currentSortType = RESET_SORT_TYPE;
    this.#handleModeChange();

    if (this.#noPointsComponent !== null) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    if (this.#sortComponent === null) {
      this.#renderSort();
    }

    this.#newPointPresenter.init(
      this.#eventListComponent?.element || this.#eventsContainer
    );
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

    if (this.#getFilteredPoints().length === 0) {
      if (this.#sortComponent !== null) {
        remove(this.#sortComponent);
        this.#sortComponent = null;
      }

      this.#renderNoPoints();
    }
  };
}