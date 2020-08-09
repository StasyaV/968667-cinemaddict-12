import {render, getFilmsInfo} from "./util.js";
import {createUserTemplate} from "./view/user.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createContentContainer} from "./view/content-container.js";
import {createFilmCard} from "./view/film-card.js";
import {createButtonLoaderTemplate} from "./view/button.js";
import {createStatTemplate} from "./view/stat.js";
import {getFilm, comments} from "./mock/film.js";
import {createfilmDetailsTemplate} from "./view/film-details.js";
import {createCommentTemplate} from "./view/comment.js";
import {generateFilter} from "./mock/filter.js";

const RENDER_CARDS_COUNT = 18;
const CARDS_PER_STEP = 5;
const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);

const filmCards = new Array(RENDER_CARDS_COUNT).fill().map(getFilm);
const filters = generateFilter(filmCards);

render(header, createUserTemplate());
render(mainContainter, createMenuTemplate(filters));
render(mainContainter, createSortTemplate());
render(mainContainter, createContentContainer());

const filmListContainer = mainContainter.querySelector(`.films-list__container`);

for (let i = 0; i < CARDS_PER_STEP; i++) {
  render(filmListContainer, createFilmCard(filmCards[i]));
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedFilmCards = CARDS_PER_STEP;

  const filmsList = mainContainter.querySelector(`.films-list`);
  render(filmsList, createButtonLoaderTemplate());

  const buttonLoader = filmsList.querySelector(`.films-list__show-more`);

  buttonLoader.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmCards, renderedFilmCards + CARDS_PER_STEP)
      .forEach((card) => render(filmListContainer, createFilmCard(card)));

    renderedFilmCards += CARDS_PER_STEP;

    if (renderedFilmCards >= filmCards.length) {
      buttonLoader.remove();
    }
  });
}

const footerContainer = document.querySelector(`.footer`);

render(footerContainer, createStatTemplate());

filmListContainer.addEventListener(`click`, function (evt) {
  let clickedCard = evt.target.closest(`.film-card`);

  if (clickedCard === null) {
    return;
  }

  let filmItem = getFilmsInfo(clickedCard.id, filmCards);

  const body = document.querySelector(`body`);
  render(body, createfilmDetailsTemplate(filmItem));

  const commentsContainer = document.querySelector(`.film-details__comments-list`);
  for (let i = 0; i < comments.length; i++) {
    render(commentsContainer, createCommentTemplate(comments[i]));
  }

  const closeDeatailCard = document.querySelector(`.film-details__close-btn`);

  closeDeatailCard.addEventListener(`click`, function () {
    const filmDetailCard = document.querySelector(`.film-details`);
    filmDetailCard.remove();
  });
});
