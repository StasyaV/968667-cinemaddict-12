import AbstractView from "./abstract.js";

const createFilmListTemplate = () => {
  return `<div class="films-list__container"></div>`;
};

export default class FilmList extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
