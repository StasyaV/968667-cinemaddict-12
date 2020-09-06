import SmartView from "./smart.js";
import CommentView from "./comment.js";
import {render, RenderPosition} from "../utils/render.js";
import {comments} from "../mock/film.js";
import {formatDate, formatTime} from "../utils/film.js";
import {Emoji} from "../const.js";

const createFilmPopupTemplate = (card, currentEmoji) => {
  const {
    name,
    img,
    fullDescription,
    commentsCount,
    raiting,
    director,
    writers,
    releaseDay,
    actors,
    ageToWatch,
    runtime,
    country,
    genre,
    id,
    isWatched,
    isFavourite,
    watchlist
  } = card;

  const date = formatDate(releaseDay);
  const time = formatTime(runtime);

  return `<section class="film-details" id=${id}>
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${img} alt="">

          <p class="film-details__age">${ageToWatch}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${name}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${raiting}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${date}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${time}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre}</span>
                <span class="film-details__genre">${genre}</span>
                <span class="film-details__genre">${genre}</span></td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${fullDescription}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavourite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

        <ul class="film-details__comments-list">


        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${currentEmoji === Emoji.SMILE ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${currentEmoji === Emoji.SLEEPING ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${currentEmoji === Emoji.PUKE ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${currentEmoji === Emoji.ANGRY ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film, emoji) {
    super();
    this._data = FilmPopup.parseFilmToData(film);
    this._emoji = emoji;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiListClickHandler = this._emojiListClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data, this._emoji);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  reset(film) {
    this.updateData(
        FilmPopup.parseFilmToData(film)
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favouriteClickHandler);
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._historyClickHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`textarea`, this._commentInputHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._emojiListClickHandler);
  }

  _renderComment(comment) {
    const commentsContainer = this.getElement().querySelector(`.film-details__comments-list`);
    const commentary = new CommentView(comment);
    render(commentsContainer, commentary, RenderPosition.BEFOREEND);
  }

  renderComments() {
    comments.forEach((comment) => this._renderComment(comment));
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setClosePopupClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
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

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      message: evt.target.value
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    if (evt.key === `ENTER` && evt.key === `CTRL`) {
      this._callback.formSubmit(FilmPopup.parseDataToFilm(this._data));
    }
  }

  _emojiListClickHandler(evt) {
    let clickedElement = evt.target.value;
    this.getElement().querySelector(`.film-details__add-emoji-label`).textContent = ``;
    if (clickedElement === Emoji.SMILE || clickedElement === Emoji.SLEEPING || clickedElement === Emoji.PUKE || clickedElement === Emoji.ANGRY) {
      let imgElement = `<img src="./images/emoji/${clickedElement}.png" width="55" height="55" alt="emoji-smile">`;
      this.getElement().querySelector(`.film-details__add-emoji-label`).insertAdjacentHTML(RenderPosition.AFTERBEGIN, imgElement);
    }
  }

  setEmojiClickHandler(callback) {
    this._callback.emojiCLick = callback;
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._emojiListClickHandler);
  }

  setFavouriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favouriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._historyClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        {
        }
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);
    return data;
  }
}
