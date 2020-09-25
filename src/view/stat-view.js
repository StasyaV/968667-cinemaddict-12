import AbstractView from "./abstract-view.js";

const createStatTemplate = () => {
  return `<p>130 291 movies inside</p>`;
};

export default class Statistic extends AbstractView {
  getTemplate() {
    return createStatTemplate();
  }
}
