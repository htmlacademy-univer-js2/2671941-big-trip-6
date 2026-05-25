import TripPresenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const tripMainContainer = document.querySelector('.trip-main');


const pointsModel = new PointsModel();

const presenter = new TripPresenter({
  tripMainContainer,
  filtersContainer,
  eventsContainer,
  pointsModel
});

presenter.init();