import FilmPresenter from "./film.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import ListContainerView from "../view/list-container.js";
import FilmListView from "../view/film-list.js";
import NoFilmsView from "../view/no-films.js";
import ButtonLoaderView from "../view/button.js";
import SortView from "../view/sort.js";
import {SortType} from "../const.js";
import {sortFilmByDate, sortFilmByRaiting} from "../utils/film.js";
import {updateItem} from "../utils/common.js";

const CARDS_PER_STEP = 5;

export default class MovieList {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._renderedFilmsCards = CARDS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};


    this._filmListContainer = new ListContainerView();
    this._filmList = new FilmListView();
    this._noFilms = new NoFilmsView();
    this._loadMoreButton = new ButtonLoaderView();
    this._sort = new SortView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    render(this._filmContainer, this._filmListContainer, RenderPosition.BEFOREEND);
    render(this._filmListContainer, this._filmList, RenderPosition.BEFOREEND);

    this._renderFilmBoard();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _renderFilm(card) {
    const filmPresenter = new FilmPresenter(this._filmList, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(card);
    this._filmPresenter[card.id] = filmPresenter;
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmByDate);
        break;
      case SortType.RAITING:
        this._films.sort(sortFilmByRaiting);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmList();
  }

  _renderSort() {
    render(this._filmContainer, this._sort, RenderPosition.AFTERBEGIN);
    this._sort.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearFilmsList() {
    Object
    .values(this._filmPresenter)
    .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCards = CARDS_PER_STEP;
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
    this._renderFilms(0, CARDS_PER_STEP);

    if (this._films.length > CARDS_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmBoard() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmList();
    this._renderSort();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }
}

