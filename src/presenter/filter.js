import MenuView from "../view/menu.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType, MenuItem} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel, statsPresenter, movieListPresenter) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._currentFilter = null;

    this._filter = null;
    this._isStats = false;
    this._movieListPresenter = movieListPresenter;
    this._statsPresenter = statsPresenter;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleOpenStatisticClick = this._handleOpenStatisticClick.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilter = this._filter;

    this._filter = new MenuView(filters, this._currentFilter);
    this._filter.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filter.setStatsButtonClickHandler(this._handleOpenStatisticClick);
    this._filter.setCloseStatisticClick(this._handleMenuClick);

    if (prevFilter === null) {
      render(this._filterContainer, this._filter, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filter, prevFilter);
    remove(prevFilter);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType && !this._isStats === true) {
      return;
    }

    if (this._isStats === true) {
      this._statsPresenter.destroy();
      this._movieListPresenter.init();
      this._isStats = false;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._moviesModel.getFilms();
    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](films).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](films).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](films).length
      }
    ];
  }

  _handleOpenStatisticClick() {
    this._movieListPresenter.destroy();
    this._statsPresenter.init();
  }

  _handleMenuClick(menuItem) {
    console.log(`click`, menuItem);
    switch (menuItem) {
      case MenuItem.ALL:
        this._statsPresenter.destroy();
        this._movieListPresenter.init();
        this._filter.setFilter(UpdateType.MAJOR, FilterType.ALL);
        break;
      case MenuItem.WATCHLIST:
        this._statsPresenter.destroy();
        this._movieListPresenter.init();
        this._filter.setFilter(UpdateType.MAJOR, FilterType.WATCHLIST);
        break;
      case MenuItem.HISTORY:
        this._statsPresenter.destroy();
        this._movieListPresenter.init();
        this._filter.setFilter(UpdateType.MAJOR, FilterType.HISTORY);
        break;
      case MenuItem.FAVORITES:
        this._statsPresenter.destroy();
        this._movieListPresenter.init();
        this._filter.setFilter(UpdateType.MAJOR, FilterType.FAVORITES);
        break;
    }
  }
}
