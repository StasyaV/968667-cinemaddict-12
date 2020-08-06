import {render} from "./util.js";
import {createUserTemplate} from "./view/user.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createContentContainer} from "./view/content-container.js";
import {createFilmCard, getFilmObj} from "./view/film-card.js";
import {createButtonLoaderTemplate} from "./view/button.js";
import {createStatTemplate} from "./view/stat.js";

const RENDERED_CARDS_COUNT = 5;
const header = document.querySelector(`.header`);
const mainContainter = document.querySelector(`.main`);


render(header, createUserTemplate());
render(mainContainter, createMenuTemplate());
render(mainContainter, createSortTemplate());
render(mainContainter, createContentContainer());

const filmListContainer = mainContainter.querySelector(`.films-list__container`);

const filmCards = new Array(RENDERED_CARDS_COUNT).fill().map(getFilmObj);

for (let i = 0; i < RENDERED_CARDS_COUNT; i++) {
  render(filmListContainer, createFilmCard(filmCards[i]));
}

// const getFilmsList = () => {
//   let filmsList = [];
//   for (let i = 0; i < 10; i++) {
//     let film = getFilmObj(i, generateCommentsList());
//     filmsList.push(film);
//   }
//   return filmsList;
// }

const filmsList = mainContainter.querySelector(`.films-list`);
render(filmsList, createButtonLoaderTemplate());

const footerContainer = document.querySelector(`.footer`);

render(footerContainer, createStatTemplate());
