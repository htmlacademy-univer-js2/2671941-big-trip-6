import { HeaderPresenter, MainPresenter } from './presenter/presenter.js';

const headerContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter({ container: headerContainer });
const mainPresenter = new MainPresenter({ container: eventsContainer });

headerPresenter.init();
mainPresenter.init();