import {render, RenderPosition, remove} from "../utils/render.js";
import {getFilmsInfo} from "../utils/common.js";
import ListContainerView from "../view/list-container.js";
import FilmListView from "../view/film-list.js";
import FilmCardView from "../view/film-card.js";
import FilmPopupView from "../view/film-details.js";
import NoFilmsView from "../view/no-films.js";
import ButtonLoaderView from "../view/button.js";

const CARDS_PER_STEP = 5;

export default class MovieList {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._renderedFilmsCards = CARDS_PER_STEP;

    this._filmListContainer = new ListContainerView();
    this._filmList = new FilmListView();
    this._noFilms = new NoFilmsView();
    this._loadMoreButton = new ButtonLoaderView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    render(this._filmContainer, this._filmListContainer, RenderPosition.BEFOREEND);
    render(this._filmListContainer, this._filmList, RenderPosition.BEFOREEND);

    this._renderFilmList();
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

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _openPopupClickHandler(evt) {
    let clickedCard = evt.target.closest(`.film-card`);

    if (clickedCard === null) {
      return;
    }

    let filmItem = getFilmsInfo(clickedCard.id, this._films);

    const body = document.querySelector(`body`);

    const filmPopup = new FilmPopupView(filmItem);
    render(body, filmPopup.getElement(), RenderPosition.BEFOREEND);
    this._callback.openPopupClick();
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
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilms(0, CARDS_PER_STEP);

    if (this._films.length > CARDS_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
}

// filmList.getElement().addEventListener(`click`, (evt) => {
//   let clickedCard = evt.target.closest(`.film-card`);

//   if (clickedCard === null) {
//     return;
//   }

//   let filmItem = getFilmsInfo(clickedCard.id, filmCards);

//   const body = document.querySelector(`body`);

//   const filmPopup = new FilmPopupView(filmItem);
//   render(body, filmPopup.getElement(), RenderPosition.BEFOREEND);

//   const commentsContainer = filmPopup.getElement().querySelector(`.film-details__comments-list`);
//   for (let comment of comments) {
//     render(commentsContainer, new CommentView(comment).getElement(), RenderPosition.BEFOREEND);
//   }

//   const closeDeatailCard = filmPopup.getElement().querySelector(`.film-details__close-btn`);

//   closeDeatailCard.addEventListener(`click`, () => {
//     filmPopup.getElement().remove();
//     filmPopup.removeElement();
//   });

//   const onEscKeyDown = (evt) => {
//     if (evt.key === `Escape` || evt.key === `Esc`) {
//       evt.preventDefault();
//       filmPopup.getElement().remove();
//       filmPopup.removeElement();
//       document.removeEventListener(`keydown`, onEscKeyDown);
//     }
//   };
