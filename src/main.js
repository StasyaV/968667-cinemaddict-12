import {render, RenderPosition} from "./utils/render.js";
import UserView from "./view/user.js";
import MenuView from "./view/menu.js";
import SortView from "./view/sort.js";
import MainContentView from "./view/content-container.js";
import StatisticView from "./view/stat.js";
import {getFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import MovieListPresenter from "./presenter/move-list.js";

const RENDER_CARDS_COUNT = 18;

const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);

const filmCards = new Array(RENDER_CARDS_COUNT).fill().map(getFilm);
const filters = generateFilter(filmCards);

render(header, new UserView().getElement(), RenderPosition.BEFOREEND);
render(mainContainter, new MenuView(filters).getElement(), RenderPosition.AFTERBEGIN);
// render(mainContainter, new SortView().getElement(), RenderPosition.BEFOREEND);

const filmContainer = new MainContentView();
render(mainContainter, filmContainer.getElement(), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(filmContainer);

movieListPresenter.init(filmCards);

const statContainer = document.querySelector(`.footer__statistics`);
render(statContainer, new StatisticView().getElement(), RenderPosition.BEFOREEND);
