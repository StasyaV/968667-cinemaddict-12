
import UserView from "../view/user-view.js";
import FooterInfoView from "../view/footer-info-view.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
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

    const prevUserRank = this._userRank;
    const prevFooterInfo = this._footerInfo;

    this._userRank = new UserView(rank);
    this._footerInfo = new FooterInfoView(films);

    if (!prevUserRank || !prevFooterInfo) {
      render(this._header, this._userRank, RenderPosition.BEFOREEND);
      render(this._footerInfoContainer, this._footerInfo, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._userRank, prevUserRank);
    replace(this._footerInfo, prevFooterInfo);
    remove(prevUserRank);
    remove(prevFooterInfo);
  }

  destroy() {
    remove(this._userRank);
    remove(this._footerInfo);
  }
}
