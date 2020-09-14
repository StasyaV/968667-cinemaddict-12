import StatisticView from "../view/statistics.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

export default class Filter {
  constructor(statContainer) {
    this._statContainer = statContainer;
  }

  init() {
    const prevStatistic = this._statistic;
    this._statistic = new StatisticView();

    render(this._statContainer, this._statistic.getElement(), RenderPosition.BEFOREEND);

    if (prevStatistic === null) {
      render(this._statContainer, this._statistic.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    // replace(this._statistic, prevStatistic);
    // remove(prevStatistic);
  }

  destroy() {
    remove(this._statistic);
    this._statistic = null;
  }
}
