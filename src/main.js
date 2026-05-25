import TripPresenter from './presenter/presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = `Basic ${crypto.randomUUID()}`;
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filtersContainer,
  pointsModel,
  filterModel
});

const presenter = new TripPresenter({
  tripMainContainer,
  eventsContainer,
  pointsModel,
  filterModel,
  newEventButton
});

filterPresenter.init();
presenter.init();

pointsModel.init();