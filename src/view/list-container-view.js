import AbstractView from "./abstract-view.js";

const createFilmListContainer = () => {
  return `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`;
};

export default class ListContainer extends AbstractView {
  getTemplate() {
    return createFilmListContainer();
  }
}
