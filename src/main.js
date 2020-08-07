import {render} from "./util.js";
import {createUserTemplate} from "./view/user.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createContentContainer} from "./view/content-container.js";
import {createFilmCard, getFilmObj, commentsArray} from "./view/film-card.js";
import {createButtonLoaderTemplate} from "./view/button.js";
import {createStatTemplate} from "./view/stat.js";
import {createfilmDetailsTemplate} from "./view/film-details.js"
import {createCommentTemplate} from "./view/comment.js";

const RENDER_CARDS_COUNT = 18;
const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);


render(header, createUserTemplate());
render(mainContainter, createMenuTemplate());
render(mainContainter, createSortTemplate());
render(mainContainter, createContentContainer());

const filmListContainer = mainContainter.querySelector(`.films-list__container`);

const filmCards = new Array(RENDER_CARDS_COUNT).fill().map(getFilmObj);

for (let i = 0; i < RENDER_CARDS_COUNT; i++) {
  render(filmListContainer, createFilmCard(filmCards[i]));
}

const filmsList = mainContainter.querySelector(`.films-list`);
render(filmsList, createButtonLoaderTemplate());

const footerContainer = document.querySelector(`.footer`);

render(footerContainer, createStatTemplate());

const body = document.querySelector(`body`);

// render(body, createfilmDetailsTemplate(filmCards[0]));

// const commentsContainer = document.querySelector(`.film-details__comments-list`);

// for (let i = 0; i < commentsArray.length; i++) {
//   render(commentsContainer, createCommentTemplate(commentsArray[i]));
// }
