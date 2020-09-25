import AbstractView from "./abstract-view.js";

const createNoTaskTemplate = () => {
  return `<h2 class="films-list__title">Loading...</h2>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
