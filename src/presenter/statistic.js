import StatisticView from "../view/statistics.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {StatsType, GENRES} from "../const.js";
import {getTotalCountGenre, getCountWatchedFilms, getRank, getTotalDuration, getTopGenre} from "../utils/statistic.js";

export default class Statistic {
  constructor(statContainer, moviesModel) {
    this._statContainer = statContainer;
    this._moviesModel = moviesModel;

    this._currentStat = StatsType.ALL;
    this._prevStatsComponent = null;
    this._filmsStats = null;
  }

  init() {
    const prevStatistic = this._statistic;
    const films = this._moviesModel.getFilms().slice();
    const filmGenres = getTotalCountGenre(films, GENRES);
    const watchedFilms = getCountWatchedFilms(films);
    const totalDuration = getTotalDuration(films);
    const yourRank = getRank(watchedFilms);
    const topGenre = getTopGenre(films, GENRES);

    this._statistic = new StatisticView(filmGenres, watchedFilms, totalDuration, yourRank, topGenre);

    render(this._statContainer, this._statistic.getElement(), RenderPosition.BEFOREEND);

    if (prevStatistic === null) {
      render(this._statContainer, this._statistic.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    replace(this._statistic, prevStatistic);
    remove(prevStatistic);

    this._statistic.setChangePeriodClickHandler(this._handleStatsPeriodChange);
  }

  destroy() {
    remove(this._statistic);
    this._statistic = null;
  }

  _handleStatsPeriodChange() {
    remove(this._statistic);
    this._statistic.init();
  }
}
