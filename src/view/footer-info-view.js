import AbstractView from "./abstract-view.js";

const createStatTemplate = (films) => {
  return `<p>${films.length} movies inside</p>`;
};

export default class FooterInfo extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createStatTemplate(this._films);
  }
}
