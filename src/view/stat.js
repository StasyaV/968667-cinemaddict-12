import AbstractView from "./abstract.js";

const createStatTemplate = () => {
  return `<p>130 291 movies inside</p>`;
};

export default class Statistic extends AbstractView {
  getTemplate() {
    return createStatTemplate();
  }
}
