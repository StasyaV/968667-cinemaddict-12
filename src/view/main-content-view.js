import AbstractView from "./abstract-view.js";

const createContentTemplate = () => {
  return `<section class="films">
    
  </section>`;
};

export default class MainContent extends AbstractView {
  getTemplate() {
    return createContentTemplate();
  }
}
