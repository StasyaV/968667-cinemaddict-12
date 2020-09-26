
import UserView from "../view/user-view.js";
import FooterInfoView from "../view/footer-info-view.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {getRank, getWatchedFilms} from "../utils/statistic.js";

export default class Info {
  constructor(header, footerInfoContainer, moviesModel) {
    this._header = header;
    this._footerInfoContainer = footerInfoContainer;
    this._moviesModel = moviesModel;
  }

  init() {
    const films = this._moviesModel.getFilms();
    const watchedFilms = getWatchedFilms(films.slice());
    const rank = getRank(watchedFilms.length);

    this._userRank = new UserView(rank);
    this._footerInfo = new FooterInfoView(films);

    render(this._header, this._userRank, RenderPosition.BEFOREEND);
    render(this._footerInfoContainer, this._footerInfo, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._userRank);
    remove(this._footerInfo);
  }
}
