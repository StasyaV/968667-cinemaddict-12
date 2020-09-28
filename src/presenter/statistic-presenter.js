import StatisticView from "../view/statistic-view.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {StatsType, GENRES} from "../const.js";
import {getFilmStats, getFilteredFilmsByDate} from "../utils/statistic.js";

export default class Statistic {
  constructor(statContainer, moviesModel) {
    this._statContainer = statContainer;
    this._moviesModel = moviesModel;

    this._currentStats = StatsType.ALL;
    this._prevStatsComponent = null;
    this._filmsStats = null;

    this._handleStatsPeriodChange = this._handleStatsPeriodChange.bind(this);
  }

  init() {
    const prevStatistic = this._statistic;
    const films = getFilteredFilmsByDate(this._moviesModel.getFilms().slice(), this._currentStats);
    const filmsStats = getFilmStats(films, GENRES);

    this._statistic = new StatisticView(filmsStats, this._currentStats);

    render(this._statContainer, this._statistic.getElement(), RenderPosition.BEFOREEND);

    this._statistic.setChangePeriodClickHandler(this._handleStatsPeriodChange);

    if (!prevStatistic) {
      render(this._statContainer, this._statistic.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    replace(this._statistic, prevStatistic);
    remove(prevStatistic);
  }

  destroy() {
    remove(this._statistic);
    this._statistic = null;
  }

  _handleStatsPeriodChange(statsType) {
    this._currentStats = StatsType[statsType];
    this.init();
  }
}
