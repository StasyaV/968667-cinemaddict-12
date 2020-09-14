import {render, RenderPosition} from "./utils/render.js";
import UserView from "./view/user.js";
import StatisticView from "./view/stat.js";
import MainContentView from "./view/content-container.js";
import StatisticPresenter from "./presenter/statistic.js";
import {getFilm} from "./mock/film.js";
import MovieListPresenter from "./presenter/move-list.js";
import FilterPresenter from "./presenter/filter.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";

const RENDER_CARDS_COUNT = 18;

const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);

const filmCards = new Array(RENDER_CARDS_COUNT).fill().map(getFilm);

const moviesModel = new MoviesModel();
moviesModel.setFilms(filmCards);

const filterModel = new FilterModel();

render(header, new UserView().getElement(), RenderPosition.BEFOREEND);

const filmContainer = new MainContentView();
render(mainContainter, filmContainer.getElement(), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(filmContainer, moviesModel, filterModel);
const statisticPresenter = new StatisticPresenter(mainContainter);
const filterPresenter = new FilterPresenter(mainContainter, filterModel, moviesModel, movieListPresenter, statisticPresenter);

movieListPresenter.init();
filterPresenter.init();

const statContainer = document.querySelector(`.footer__statistics`);
render(statContainer, new StatisticView().getElement(), RenderPosition.BEFOREEND);
