import AbstractView from "./abstract.js";

const createButtonLoaderTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ButtonLoader extends AbstractView {
  getTemplate() {
    return createButtonLoaderTemplate();
  }
}
