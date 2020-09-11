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

    this.openPopupClickHandler = this.openPopupClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmPopup = this._filmPopup;
    const prevFilmCard = this._filmCard;

    this._filmCard = new FilmCardView(film);
    this._filmPopup = new FilmPopupView(film);

    this._filmCard.setOpenPopupClickHandler(this.openPopupClickHandler);
    this._filmCard.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCard.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setClosePopupClickHandler(this._closePopupClickHandler);
    this._filmPopup.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmPopup.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setAddCommentHandler(this._handleAddComment);

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

  openPopupClickHandler() {
    const body = document.querySelector(`body`);
    render(body, this._filmPopup, RenderPosition.BEFOREEND);

    this._filmPopup.renderComments(this._film.commentsCount);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closePopupClickHandler() {
    remove(this._filmPopup);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleDeleteClick(commentId) {
    const index = this._film.comments.findIndex((comment) => comment.id === Number(commentId));
    const updatedComments = [
      ...this._film.comments.slice(0, index),
      ...this._film.comments.slice(index + 1)
    ];

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.POPUP,
        Object.assign(
            {},
            this._film,
            {
              comments: updatedComments
            }
        )
    );
  }

  _handleAddComment(newComment, newEmoji) {
    const updatedComments = this._film.comments.slice();
    console.log(updatedComments);
    updatedComments.push({
      id: this._film.commentsCount + 1,
      emoji: newEmoji,
      comment: newComment,
      nickname: `Alexa M`,
      dateComment: new Date(),
    });

    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.POPUP,
        Object.assign(
            {},
            this._film,
            {
              comments: updatedComments
            }
        )
    );
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
