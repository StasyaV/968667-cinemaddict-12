import {render, RenderPosition, remove, replace} from "../utils/render.js";
import FilmPopupView from "../view/film-details.js";
import FilmCardView from "../view/film-card.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode, api) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._api = api;

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

    this._filmCard = new FilmCardView(this._film);
    this._filmPopup = new FilmPopupView(this._film);

    this._filmCard.setOpenPopupClickHandler(this.openPopupClickHandler);
    this._filmCard.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCard.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setClosePopupClickHandler(this._closePopupClickHandler);
    this._filmPopup.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmPopup.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setAddCommentHandler(this._handleAddComment);
    this._filmPopup.setDeleteClickHandler(this._handleDeleteClick);

    if (prevFilmPopup === null || prevFilmCard === null) {
      render(this._filmListContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmCard, prevFilmCard);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopup, prevFilmPopup);
    }

    this._filmPopup.renderComments();

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

  _handleDeleteClick(commentId) {
    const updatedComments = this._film.comments.filter((comment) => comment.id !== commentId);
    const movie = Object.assign(
        {},
        this._film,
        {
          comments: updatedComments
        }
    );

    const filmToUpdate = {
      commentIdToDelete: commentId,
      movie
    };

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.DELETE,
        filmToUpdate
    );
  }

  _handleAddComment(newComment, newEmoji) {
    const updatedComments = this._film.comments.slice();
    const comment = {
      "comment": newComment,
      "date": (new Date()).toISOString(),
      "emotion": newEmoji
    };

    updatedComments.push(comment);

    const movie = Object.assign(
        {},
        this._film,
        {
          comments: updatedComments
        }
    );

    const filmToUpdate = {
      movie,
      comment
    };

    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.ADD,
        filmToUpdate
    );
  }

  deletingErrorHandler(commentId) {
    const errorComment = this._filmPopup.getElement().querySelector(`li[id="${commentId}"]`);
    this._filmPopup.errorAnimation(errorComment, () => {
      errorComment.style.animation = ``;
      const deletingButton = errorComment.querySelector(`button`);
      deletingButton.textContent = `Delete`;
      deletingButton.disabled = false;
    });
  }

  addingErrorHandler() {
    const commentInput = this._filmPopup.getElement().querySelector(`.film-details__comment-input`);
    this._filmPopup.errorAnimation(commentInput, () => {
      commentInput.style.animation = ``;
      commentInput.disabled = false;
      commentInput.style.color = `black`;
      commentInput.textContent = ``;
    });
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
              isWatched: !this._film.isWatched,
              watchingDate: (this._film.isWatched) ? null : new Date()
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
