import AbstractView from "./abstract.js";

const createFilmListTemplate = () => {
  return `<div class="films-list__container"></div>`;
};

export default class FilmList extends AbstractView {
  constructor() {
    super();
    this._openBigCardHandler = this._openBigCardHandler.bind(this);
  }

  getTemplate() {
    return createFilmListTemplate();
  }

  _openBigCardHandler(evt) {
    let clickedCard = evt.target.closest(`.film-card`);

    if (clickedCard === null) {
      return;
    }
  }

  setOpenBigCardHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._openBigCardHandler);
  }
}
