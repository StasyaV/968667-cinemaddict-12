import {render, RenderPosition, remove} from "../utils/render.js";
import ListContainerView from "../view/list-container.js";
import FilmListView from "../view/film-list.js";
import FilmCardView from "../view/film-card.js";
import NoFilmsView from "../view/no-films.js";
import ButtonLoaderView from "../view/button.js";
import {getFilm} from "../mock/film.js";

const RENDER_CARDS_COUNT = 18;
const CARDS_PER_STEP = 5;
const mainContainter = document.querySelector(`.main`);
let renderedFilmCards = CARDS_PER_STEP;

const filmCards = new Array(RENDER_CARDS_COUNT).fill().map(getFilm);

export default class MovieList {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._renderedFilmCount = CARDS_PER_STEP;

    this._filmListContainer = new ListContainerView();
    this._filmList = new FilmListView();
    this._noFilms = new NoFilmsView();
    this._loadMoreButton = new ButtonLoaderView();

    this._handleButtonLoaderClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init() {
    this._filmCards = filmCards.slice();

    render(this._filmList, this._filmList, RenderPosition.BEFOREEND);
    render(this._filmList, this._filmCards, RenderPosition.BEFOREEND);

    this._renderFilmListContainer();
  }

  _renderMainContainer() {
    render(mainContainter, this._mainFilmContainer.getElement(), RenderPosition.BEFOREEND);
  }

  _renderFilmListContainer() {
    render(this._filmContainer.getElement(), this._filmListContainer.getElement(), RenderPosition.AFTERBEGIN);
  }

  _renderFilm() {
    render(this._filmListContainer.getElement(), this._filmList.getElement(), RenderPosition.AFTERBEGIN);

    for (let i = 0; i < CARDS_PER_STEP; i++) {
      render(this._filmList.getElement(), new FilmCardView(filmCards[i]).getElement(), RenderPosition.AFTERBEGIN);
    }
  }

  _renderFilms() {
    filmCards
      .slice(renderedFilmCards, renderedFilmCards + CARDS_PER_STEP)
      .forEach((card) => render(this._filmList.getElement(), new FilmCardView(card).getElement(), RenderPosition.AFTERBEGIN));
  }

  _renderNoFilms() {
    if (this._filmCards.length < 0) {
      render(this._filmList, this._noFilms, RenderPosition.AFTERBEGIN);
    }
  }

  _handleLoadMoreButtonClick() {
    this._renderFilms(this._renderedFilmCards, this._renderedFilmCards += CARDS_PER_STEP);
    this._renderedFilmCards += CARDS_PER_STEP;

    if (this._renderedFilmCards >= this._filmCards.length) {
      remove(this._loadMoreButton);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmListContainer, this._loadMoreButton, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmList() {
    this._renderTasks(0, Math.min(this._filmCards.length, CARDS_PER_STEP));

    if (this._filmCards.length > CARDS_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
}
