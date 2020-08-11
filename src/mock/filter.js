const filmToFilterMap = {
  Watchlist: (items) => items.filter((item) => item.watchlist).length,
  History: (items) => items.filter((item) => item.isWatched).length,
  Favorites: (items) => items.filter((item) => item.isFavourite).length
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
