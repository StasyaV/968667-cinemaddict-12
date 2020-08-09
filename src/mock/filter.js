const filmToFilterMap = {
  all: (items) => items.length,
  favorites: (items) => items.filter((item) => item.isFavourite).length,
  history: (items) => items.filter((item) => item.isWatched).length,
  watchlist: (items) => items.filter((item) => item.watchlist).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
