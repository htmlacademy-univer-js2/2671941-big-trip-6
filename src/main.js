import TripPresenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js'; // Убедитесь, что путь правильный

const headerContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

// Создаем экземпляр модели
const pointsModel = new PointsModel();

const presenter = new TripPresenter({
headerContainer: headerContainer,
  eventsContainer: eventsContainer,
  pointsModel: pointsModel // Добавляем модель в презентер
});

presenter.init();