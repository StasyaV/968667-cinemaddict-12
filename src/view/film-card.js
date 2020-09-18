import AbstractView from "./abstract.js";
import {formatDuration, getShortDescription} from "../utils/film.js";

const createFilmCardTemplate = (card) => {
  const {
    name,
    shortDescription,
    img,
    comments,
    raiting,
    year,
    runtime,
    genre,
    id,
    isFavourite,
    isWatched,
    watchlist
  } = card;

  return `<article class="film-card" id=${id}>
  <h3 class="film-card__title">${name}</h3>
  <p class="film-card__rating">${raiting}</p>
  <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${formatDuration(runtime)}</span>
    <span class="film-card__genre">${genre.size > 0 ? genre.values().next().value : ``}</span>
  </p>
  <img src=${img} alt="" class="film-card__poster">
  <p class="film-card__description">${getShortDescription(shortDescription)}</p>
  <a class="film-card__comments">${comments} comments</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavourite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
  </form>
</article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _openPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  setOpenPopupClickHandler(callback) {
    const elementsClassToClick = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];
    this._callback.openClick = callback;
    for (let i = 0; i < elementsClassToClick.length; i++) {
      this.getElement().querySelector(elementsClassToClick[i]).addEventListener(`click`, this._openPopupClickHandler);
    }
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  setFavouriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favouriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._historyClickHandler);
  }
}
