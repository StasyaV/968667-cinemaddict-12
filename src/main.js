import {UpdateType} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";
import UserView from "./view/user-view.js";
import StatisticView from "./view/stat-view.js";
import MainContentView from "./view/content-container-view.js";
import StatisticPresenter from "./presenter/statistic-presenter.js";
import MovieListPresenter from "./presenter/move-list-presenter.js";
import FilterPresenter from "./presenter/filter-presenter.js";
import MoviesModel from "./model/movies-model.js";
import FilterModel from "./model/filter-model.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic hS2JK3dhrt14fsa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);
const statContainer = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const filmContainer = new MainContentView();
const movieListPresenter = new MovieListPresenter(filmContainer, moviesModel, filterModel, apiWithProvider);
const statisticPresenter = new StatisticPresenter(mainContainter, moviesModel);
const filterPresenter = new FilterPresenter(mainContainter, filterModel, moviesModel, statisticPresenter, movieListPresenter);

render(header, new UserView().getElement(), RenderPosition.BEFOREEND);
render(mainContainter, filmContainer.getElement(), RenderPosition.BEFOREEND);
render(statContainer, new StatisticView().getElement(), RenderPosition.BEFOREEND);

movieListPresenter.init();
filterPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    const filmIds = films.map((film) => film.id);
    const promises = filmIds.map((id) => apiWithProvider.getComments(id));

    Promise.all(promises).then((commentsList) => {
      const filmWithComments = films.map((film, index) => {
        return Object.assign(
            {},
            film,
            {
              comments: commentsList[index]
            }
        );
      });

      moviesModel.setFilms(UpdateType.INIT, filmWithComments);
    });
  })
  .catch(() => {
    moviesModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
        console.log(`ServiceWorker available`); // eslint-disable-line
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
        console.error(`ServiceWorker isn't available`); // eslint-disable-line
      });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
