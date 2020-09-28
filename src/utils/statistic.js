import moment from "moment";
import {RANKS, StatsType} from "../const.js";

const statsFilter = {
  [StatsType.ALL]: (films) => films,
  [StatsType.TODAY]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `day`)),
  [StatsType.WEEK]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `week`)),
  [StatsType.MONTH]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `month`)),
  [StatsType.YEAR]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `year`)),
};

export const getFilteredFilmsByDate = (films, mode) => {
  return statsFilter[mode](films);
};

const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.genre.has(genre)).length;
};

export const getRank = (watchedFilms) => {
  for (const rank of RANKS) {
    if (watchedFilms <= Object.values(rank)) {
      return Object.keys(rank)[0];
    }
  }
  return ``;
};

const getPopularGenres = (films, genres) => {
  const totalCountGenres = [];
  if (films.length > 0) {
    for (const genre of genres) {
      totalCountGenres.push(countFilmsByGenre(films, genre));
    }
  }
  return totalCountGenres;
};

const getTopGenre = (films, genres) => {
  if (films.length > 0) {
    const maxNum = Math.max.apply(null, getPopularGenres(films, genres));
    const index = getPopularGenres(films, genres).indexOf(maxNum);
    return genres[index];
  }
  return ``;
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

const getTotalDuration = (films) => {
  return films.reduce((num, film) => num + film.runtime, 0);
};

export const getFilmStats = (films, genres) => {
  const watchedFilms = getWatchedFilms(films);
  const genresCount = getPopularGenres(watchedFilms, genres);
  const totalDuration = getTotalDuration(watchedFilms);
  const rank = getRank(watchedFilms.length);
  const topGenre = getTopGenre(watchedFilms, genres);

  return {
    genresCount,
    watchedFilms,
    totalDuration,
    rank,
    topGenre
  };
};
