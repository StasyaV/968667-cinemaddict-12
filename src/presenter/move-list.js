import {render, RenderPosition, remove} from "../utils/render.js";
import ListContainerView from "../view/list-container.js";
import FilmListView from "../view/film-list.js";
import FilmCardView from "../view/film-card.js";
import NoFilmsView from "../view/no-films.js";
import ButtonLoaderView from "../view/button.js";

const CARDS_PER_STEP = 5;

export default class MovieList {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._renderedFilmsCards = CARDS_PER_STEP;

    this._filmListContainer = new ListContainerView();
    this._filmList = new FilmListView();
    this._noFilms = new NoFilmsView();
    this._loadMoreButton = new ButtonLoaderView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    render(this._filmContainer, this._filmListContainer, RenderPosition.BEFOREEND);
    render(this._filmListContainer, this._filmList, RenderPosition.BEFOREEND);

    this._renderFilmList();
  }

  _renderFilm(card) {
    const filmCard = new FilmCardView(card);

    render(this._filmList, filmCard, RenderPosition.BEFOREEND);
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _renderNoFilms() {
    render(this._filmList, this._noFilms, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCards, this._renderedFilmsCards + CARDS_PER_STEP);
    this._renderedFilmsCards += CARDS_PER_STEP;

    if (this._renderedFilmsCards >= this._films.length) {
      remove(this._loadMoreButton);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmListContainer, this._loadMoreButton, RenderPosition.BEFOREEND);

    this._loadMoreButton.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmList() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilms(0, CARDS_PER_STEP);

    if (this._films.length > CARDS_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
}
