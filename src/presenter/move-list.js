import FilmPresenter from "./film.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import ListContainerView from "../view/list-container.js";
import FilmListView from "../view/film-list.js";
import NoFilmsView from "../view/no-films.js";
import ButtonLoaderView from "../view/button.js";
import LoadingView from "../view/loading.js";
import SortView from "../view/sort.js";
import {SortType, UpdateType, UserAction} from "../const.js";
import {sortFilmByDate, sortFilmByRaiting} from "../utils/film.js";
import {filter} from "../utils/filter.js";

const CARDS_PER_STEP = 5;

export default class MovieList {
  constructor(filmContainer, moviesModel, filterModel, api) {
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._filmContainer = filmContainer;
    this._renderedFilmsCards = CARDS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._loadMoreButton = null;
    this._sort = null;

    this._filmListContainer = new ListContainerView();
    this._filmList = new FilmListView();
    this._noFilms = new NoFilmsView();
    this._loadingList = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    render(this._filmContainer, this._filmListContainer, RenderPosition.BEFOREEND);
    render(this._filmListContainer, this._filmList, RenderPosition.BEFOREEND);

    this._renderFilmBoard();

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._filmListContainer);
    remove(this._filmList);

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._moviesModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._moviesModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmByDate);
      case SortType.RAITING:
        return filtredFilms.sort(sortFilmByRaiting);
    }
    return filtredFilms;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._moviesModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update).then((response) => {
          this._moviesModel.addComment(updateType, response);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update).then(() => {
          this._moviesModel.deleteComment(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmBoard();
        this._renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmBoard();
        break;
      case UpdateType.POPUP:
        console.log(data);
        this._filmPresenter[parseInt(data.movie.id, 10)].init(data.movie);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingList);
        this._renderFilmBoard();
        break;
    }
  }

  _renderFilm(card) {
    const filmPresenter = new FilmPresenter(this._filmList, this._handleViewAction, this._handleModeChange, this._api);
    this._api.getComments(card.id)
      .then((comments) => {
        const film = Object.assign(
            {},
            card,
            {
              comments: comments.slice(),
            }
        );
        filmPresenter.init(film);
        this._filmPresenter[film.id] = filmPresenter;
      })
      .catch(() => {
        card.comments = [];
        filmPresenter.init(card);
        this._filmPresenter[card.id] = filmPresenter;
      });
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmBoard({resetRenderedFilmCount: true});
    this._renderFilmBoard();
  }

  _renderSort() {
    if (this._sort !== null) {
      this._sort = null;
    }

    this._sort = new SortView(this._currentSortType);
    this._sort.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmContainer, this._sort, RenderPosition.AFTERBEGIN);
  }

  _clearFilmsList() {
    Object
    .values(this._filmPresenter)
    .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCards = CARDS_PER_STEP;
  }

  _clearFilmBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = CARDS_PER_STEP;
    } else {
      this._renderedFilmkCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    remove(this._sort);
    remove(this._noFilms);
    remove(this._loadMoreButton);
    remove(this._loadingList);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  _renderLoading() {
    render(this._filmList, this._loadingList, RenderPosition.AFTERBEGIN);
  }

  _renderNoFilms() {
    render(this._filmList, this._noFilms, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCards = Math.min(filmCount, this._renderedFilmsCards + CARDS_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCards, newRenderedFilmCards);

    this._renderFilms(films);
    this._renderedFilmsCards = newRenderedFilmCards;

    if (this._renderedFilmsCards >= filmCount) {
      remove(this._loadMoreButton);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButton !== null) {
      this._loadMoreButton = null;
    }

    this._loadMoreButton = new ButtonLoaderView();
    this._loadMoreButton.setClickHandler(this._handleLoadMoreButtonClick);

    render(this._filmListContainer, this._loadMoreButton, RenderPosition.BEFOREEND);
  }

  _renderFilmList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, CARDS_PER_STEP));
    this._renderFilms(films);

    if (filmCount > CARDS_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getFilms().length === 0) {
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

