import {FilterType} from "../const.js";

export const filter = {
  [FilterType.ALL]: (items) => items,
  [FilterType.WATCHLIST]: (items) => items.filter((item) => item.watchlist),
  [FilterType.HISTORY]: (items) => items.filter((item) => item.isWatched),
  [FilterType.FAVORITES]: (items) => items.filter((item) => item.isFavourite)
};
