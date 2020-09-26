import AbstractView from "./abstract-view.js";

const createMenuItemTemplate = (filter, currentFilterType) => {
  const {
    type,
    name,
    count
  } = filter;

  return (
    `<a href="#${name}" class="main-navigation__item  ${type === currentFilterType ? `main-navigation__item--active` : ``}" name="${type}">${name}
    ${count > 5 || type === `All` ? `` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createMenuTemplate = (filterItems, currentFilterType) => {
  const menuItemsTemplate = filterItems
    .map((filter) => createMenuItemTemplate(filter, currentFilterType))
    .join(``);

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    ${menuItemsTemplate}
  </div>
    <a href="#stats" id="stats" class="main-navigation__additional" name="stats">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._isStatsActive = false;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsButtonClickHandler = this._statsButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A` || evt.target.id === `stats`) {
      return;
    }

    this._callback.filterTypeChange(evt.target.name);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  setStatsButtonClickHandler(callback) {
    this._callback.statsButton = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statsButtonClickHandler);
  }

  _statsButtonClickHandler(evt) {
    evt.preventDefault();

    this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    this.getElement().querySelector(`.main-navigation__additional`).classList.add(`main-navigation__item--active`);
    this._callback.statsButton();
  }
}
