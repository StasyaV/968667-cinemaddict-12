import {render, RenderPosition, remove, replace} from "../utils/render.js";
import FilmPopupView from "../view/film-details.js";
import FilmCardView from "../view/film-card.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._film = null;
    this._filmPopup = null;
    this._mode = Mode.DEFAULT;

    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmPopup = this._filmPopup;
    const prevFilmCard = this._filmCard;

    this._filmCard = new FilmCardView(film);
    this._filmPopup = new FilmPopupView(film);

    this._filmCard.setOpenPopupClickHandler(this._openPopupClickHandler);
    this._filmCard.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCard.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setClosePopupClickHandler(this._closePopupClickHandler);
    this._filmPopup.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmPopup.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setSubmitCommentHandler(this._handleFormSubmit);

    if (prevFilmPopup === null || prevFilmCard === null) {
      render(this._filmListContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmCard, prevFilmCard);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopup, prevFilmPopup);
      this._filmPopup.renderComments();
    }

    remove(prevFilmCard);
    remove(prevFilmPopup);
  }

  destroy() {
    remove(this._filmCard);
    remove(this._filmPopup);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopupClickHandler();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._filmPopup.reset(this._film);
      remove(this._filmPopup);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._mode = Mode.DEFAULT;
    }
  }

  _openPopupClickHandler() {
    const body = document.querySelector(`body`);
    render(body, this._filmPopup, RenderPosition.BEFOREEND);

    this._filmPopup.renderComments();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closePopupClickHandler() {
    remove(this._filmPopup);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleFormSubmit(update) {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        update
    );

    this._filmPopup.init();
  }

  addComment(updateType, update) {
    this._film.comments = [
      update,
      ...this._film.comments
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._film.comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._film = [
      ...this._film.comments.slice(0, index),
      ...this._film.comments.slice(index + 1)
    ];

    this._notify(updateType);
  }

  _handleFavouriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavourite: !this._film.isFavourite
            }
        )
    );
  }

  _handleHistoryClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              watchlist: !this._film.watchlist
            }
        )
    );
  }
}
