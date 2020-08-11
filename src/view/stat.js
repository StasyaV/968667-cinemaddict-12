import {createElement} from "../util.js";

const createStatTemplate = () => {
  return `<p>130 291 movies inside</p>`;
};

export default class Statistic {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createStatTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
