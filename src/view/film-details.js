import SmartView from "./smart.js";
import CommentView from "./comment.js";
import {render, RenderPosition, renderTemplate} from "../utils/render.js";
import {formatReleaseDate, formatDuration} from "../utils/film.js";
import {Emoji, DISABLE_COLOR, ERROR_ANIMATION_TIMEOUT} from "../const.js";

const getGenresTemplate = (genres) => {
  let result = ``;
  for (const genre of genres) {
    result += `<span class="film-details__genre">${genre}</span>`;
  }
  return result;
};

const createFilmPopupTemplate = (card, currentEmoji) => {
  const {
    name,
    alternativeName,
    img,
    description,
    comments,
    rating,
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

  const date = formatReleaseDate(releaseDay, true);
  const time = formatDuration(runtime);

  return `<section class="film-details" id=${id}>
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${img} alt="">

          <p class="film-details__age">+${ageToWatch}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${alternativeName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
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
              <td class="film-details__term">${genre.size > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${getGenresTemplate(genre)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

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
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._addCommentClickHandler = this._addCommentClickHandler.bind(this);

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
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._emojiListClickHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._addCommentClickHandler);
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteCommentClickHandler);
  }

  _renderComment(comment) {
    const commentsContainer = this.getElement().querySelector(`.film-details__comments-list`);
    const commentary = new CommentView(comment);
    render(commentsContainer, commentary, RenderPosition.BEFOREEND);
  }

  renderComments() {
    const comments = this._data.comments;
    return comments.forEach((comment) => this._renderComment(comment));
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

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `BUTTON`) {
      return;
    }

    if (evt.target.disabled) {
      return;
    }

    evt.target.disabled = true;
    evt.target.textContent = `Deleting...`;
    evt.target.closest(`.film-details__comment`).style.opacity = `0.5`;

    const commentId = evt.target.closest(`.film-details__comment`).id;
    this._callback.deleteComment(commentId);
  }

  _addCommentClickHandler(evt) {
    if (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();

      const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
      const emojiField = this.getElement().querySelector(`.film-details__add-emoji-label`);

      if (!this._emoji) {
        this._userWarning(emojiField);
        return;
      }

      if (!commentInput.value) {
        this._userWarning(commentInput);
        return;
      }

      commentInput.disabled = true;
      commentInput.style.color = DISABLE_COLOR;
      emojiField.style.opacity = `0.5`;

      this._callback.addComment(commentInput.value, this._emoji ? this._emoji : `smile`);
    }
  }

  errorAnimation(errorElement, afterErrFunc) {
    errorElement.style.animation = `shake ${ERROR_ANIMATION_TIMEOUT / 1000}s`;
    errorElement.style.boxShadow = `1px 1px 8px red`;
    errorElement.onanimationend = () => {
      afterErrFunc();
    };
  }

  _userWarning(element) {
    this.errorAnimation(element, () => {
      element.style.outline = `none`;
      element.style.animation = ``;
      element.style.boxShadow = `none`;
    });
  }


  setDeleteClickHandler(callback) {
    this._callback.deleteComment = callback;

    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteCommentClickHandler);
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._addCommentClickHandler);
  }

  _emojiListClickHandler(evt) {
    const chosenEmoji = evt.target.value;
    this.getElement().querySelector(`.film-details__add-emoji-label`).textContent = ``;
    if (chosenEmoji === Emoji.SMILE || chosenEmoji === Emoji.SLEEPING || chosenEmoji === Emoji.PUKE || chosenEmoji === Emoji.ANGRY) {
      const imgElement = `<img src="./images/emoji/${chosenEmoji}.png" width="55" height="55" alt="emoji-smile">`;
      renderTemplate(this.getElement().querySelector(`.film-details__add-emoji-label`), imgElement, RenderPosition.AFTERBEGIN);
      this._emoji = chosenEmoji;
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
