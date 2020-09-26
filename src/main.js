import {UpdateType} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";
import MainContentView from "./view/content-container-view.js";
import StatisticPresenter from "./presenter/statistic-presenter.js";
import MovieListPresenter from "./presenter/move-list-presenter.js";
import FilterPresenter from "./presenter/filter-presenter.js";
import InfoPresenter from "./presenter/info-presenter.js";
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
const footerInfoContainer = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const filmContainer = new MainContentView();
const movieListPresenter = new MovieListPresenter(filmContainer, moviesModel, filterModel, apiWithProvider);
const statisticPresenter = new StatisticPresenter(mainContainter, moviesModel);
const filterPresenter = new FilterPresenter(mainContainter, filterModel, moviesModel, statisticPresenter, movieListPresenter);
const infoPresenter = new InfoPresenter(header, footerInfoContainer, moviesModel);

render(mainContainter, filmContainer.getElement(), RenderPosition.BEFOREEND);

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
    })
    .finally(() => {
      infoPresenter.init();
    });
  })
  .catch(() => {
    moviesModel.setFilms(UpdateType.INIT, []);
    infoPresenter.init();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
      }).catch(() => {
      });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
