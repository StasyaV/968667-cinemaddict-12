import {render, RenderPosition, remove, replace} from "../utils/render.js";
import FilmPopupView from "../view/film-details.js";
import FilmCardView from "../view/film-card.js";

export default class Film {
  constructor(filmListContainer, changeData) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;

    this._film = null;
    this._filmPopup = null;

    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevfilmPopup = this._filmPopup;
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

    if (prevfilmPopup === null || prevFilmCard === null) {
      render(this._filmListContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmCard.getElement())) {
      replace(this._filmCard, prevFilmCard);
    }

    remove(prevFilmCard);
  }

  destroy() {
    remove(this._filmCard);
    remove(this._filmPopup);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      remove(this._filmPopup);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _openPopupClickHandler() {
    const body = document.querySelector(`body`);
    render(body, this._filmPopup, RenderPosition.BEFOREEND);

    this._filmPopup.renderComments();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _closePopupClickHandler() {
    remove(this._filmPopup);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFavouriteClick() {
    this._changeData(
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
