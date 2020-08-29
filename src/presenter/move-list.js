import {render, RenderPosition, remove} from "../utils/render.js";
import ListContainerView from "../view/list-container.js";
import FilmListView from "../view/film-list.js";
import FilmCardView from "../view/film-card.js";
import FilmPopupView from "../view/film-details.js";
import NoFilmsView from "../view/no-films.js";
import ButtonLoaderView from "../view/button.js";
import SortView from "../view/sort.js";
import {SortType} from "../const.js";
import {sortFilmByDate, sortFilmByRaiting} from "../utils/film.js";

const CARDS_PER_STEP = 5;

export default class MovieList {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._renderedFilmsCards = CARDS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;


    this._filmListContainer = new ListContainerView();
    this._filmList = new FilmListView();
    this._noFilms = new NoFilmsView();
    this._loadMoreButton = new ButtonLoaderView();
    this._sort = new SortView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    render(this._filmContainer, this._filmListContainer, RenderPosition.BEFOREEND);
    render(this._filmListContainer, this._filmList, RenderPosition.BEFOREEND);

    this._renderFilmBoard();
    // this._renderSort();
  }

  _renderFilm(card) {
    const filmCard = new FilmCardView(card);
    const filmPopup = new FilmPopupView(card);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        remove(filmPopup);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const openPopup = () => {
      const body = document.querySelector(`body`);
      render(body, filmPopup, RenderPosition.BEFOREEND);

      filmPopup.renderComments();

      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closePopup = () => {
      remove(filmPopup);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    filmCard.setOpenPopupClickHandler(openPopup);
    filmPopup.setClosePopupClickHandler(closePopup);

    render(this._filmList, filmCard, RenderPosition.BEFOREEND);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmByDate);
        break;
      case SortType.RAITING:
        sortFilmByRaiting(this._films);
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
    this._renderFilmBoard();
  }

  _renderSort() {
    render(this._filmContainer, this._sort, RenderPosition.AFTERBEGIN);
    this._sort.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearFilmsList() {
    this._filmList.getElement().innerHTML = ``;
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
}

