import {render, RenderPosition} from "./utils/render.js";
import UserView from "./view/user.js";
import StatisticView from "./view/stat.js";
import MainContentView from "./view/content-container.js";
import StatisticPresenter from "./presenter/statistic.js";
import MovieListPresenter from "./presenter/move-list.js";
import FilterPresenter from "./presenter/filter.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import Api from "./api.js";
import {UpdateType} from "./const.js";

const AUTHORIZATION = `Basic hS2JK3dhrt14fsa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);
const statContainer = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const filmContainer = new MainContentView();
const movieListPresenter = new MovieListPresenter(filmContainer, moviesModel, filterModel, api);
const statisticPresenter = new StatisticPresenter(mainContainter, moviesModel);
const filterPresenter = new FilterPresenter(mainContainter, filterModel, moviesModel, statisticPresenter, movieListPresenter);

render(header, new UserView().getElement(), RenderPosition.BEFOREEND);
render(mainContainter, filmContainer.getElement(), RenderPosition.BEFOREEND);
render(statContainer, new StatisticView().getElement(), RenderPosition.BEFOREEND);

movieListPresenter.init();
filterPresenter.init();

api.getFilms()
  .then((films) => {
    moviesModel.setFilms(UpdateType.INIT, films);
  });
// .catch(() => {
//   moviesModel.setFilms(UpdateType.INIT, []);
// });
