import {render} from "./util.js";
import {createUserTemplate} from "./view/user.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createContentContainer, createTopRatedTemplate, createMostCommentedTemplate} from "./view/content-container.js";
import {createFilmCard} from "./view/film-card.js";
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

for (let i = 0; i < RENDERED_CARDS_COUNT; i++) {
  render(filmListContainer, createFilmCard());
}

const filmsList = mainContainter.querySelector(`.films-list`);
render(filmsList, createButtonLoaderTemplate());

const filmContainer = mainContainter.querySelector(`.films`);

render(filmContainer, createTopRatedTemplate());
render(filmContainer, createMostCommentedTemplate());

const footerContainer = document.querySelector(`.footer`);

render(footerContainer, createStatTemplate());
