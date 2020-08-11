import {render, RenderPosition, getFilmsInfo} from "./util.js";
import UserView from "./view/user.js";
import MenuView from "./view/menu.js";
import SortView from "./view/sort.js";
import MainContentView from "./view/content-container.js";
import ListContainerView from "./view/list-container.js";
import FilmListView from "./view/film-list.js";
import FilmCardView from "./view/film-card.js";
import ButtonLoaderView from "./view/button.js";
import StatisticView from "./view/stat.js";
import FilmPopupView from "./view/film-details.js";
import CommentView from "./view/comment.js";
import {getFilm, comments} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

const RENDER_CARDS_COUNT = 18;
const CARDS_PER_STEP = 5;
const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);

const filmCards = new Array(RENDER_CARDS_COUNT).fill().map(getFilm);
const filters = generateFilter(filmCards);

render(header, new UserView().getElement(), RenderPosition.BEFOREEND);
render(mainContainter, new MenuView(filters).getElement(), RenderPosition.AFTERBEGIN);
render(mainContainter, new SortView().getElement(), RenderPosition.BEFOREEND);

const filmContainer = new MainContentView();
render(mainContainter, filmContainer.getElement(), RenderPosition.BEFOREEND);
const filmListContainer = new ListContainerView();
render(filmContainer.getElement(), filmListContainer.getElement(), RenderPosition.AFTERBEGIN);
render(filmListContainer.getElement(), new ButtonLoaderView().getElement(), RenderPosition.BEFOREEND);
const filmList = new FilmListView();
render(filmListContainer.getElement(), filmList.getElement(), RenderPosition.AFTERBEGIN);

for (let i = 0; i < CARDS_PER_STEP; i++) {
  render(filmList.getElement(), new FilmCardView(filmCards[i]).getElement(), RenderPosition.AFTERBEGIN);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedFilmCards = CARDS_PER_STEP;

  const buttonLoader = filmListContainer.getElement().querySelector(`.films-list__show-more`);

  buttonLoader.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmCards, renderedFilmCards + CARDS_PER_STEP)
      .forEach((card) => render(filmList.getElement(), new FilmCardView(card).getElement(), RenderPosition.AFTERBEGIN));

    renderedFilmCards += CARDS_PER_STEP;

    if (renderedFilmCards >= filmCards.length) {
      buttonLoader.remove();
    }
  });
}

const statContainer = document.querySelector(`.footer__statistics`);

render(statContainer, new StatisticView().getElement(), RenderPosition.BEFOREEND);

filmList.getElement().addEventListener(`click`, function (evt) {
  let clickedCard = evt.target.closest(`.film-card`);

  if (clickedCard === null) {
    return;
  }

  let filmItem = getFilmsInfo(clickedCard.id, filmCards);

  const body = document.querySelector(`body`);
  render(body, new FilmPopupView(filmItem).getElement(), RenderPosition.BEFOREEND);

  const commentsContainer = document.querySelector(`.film-details__comments-list`);
  for (let comment of comments) {
    render(commentsContainer, new CommentView(comment).getElement(), RenderPosition.BEFOREEND);
  }

  const closeDeatailCard = document.querySelector(`.film-details__close-btn`);

  closeDeatailCard.addEventListener(`click`, function () {
    const filmDetailCard = document.querySelector(`.film-details`);
    filmDetailCard.remove();
  });
});
