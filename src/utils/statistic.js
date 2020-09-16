import moment from "moment";
import {RANKS, StatsType} from "../const.js";

const statsFilter = {
  [StatsType.ALL]: (films) => films,
  [StatsType.TODAY]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `day`)),
  [StatsType.WEEK]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `week`)),
  [StatsType.MONTH]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `month`)),
  [StatsType.YEAR]: (films) => films.filter((film) => moment().isSame(moment(film.watchingDate), `year`)),
};

export const getFiltredFilmsByDate = (films, mode) => {
  return statsFilter[mode](films);
};

const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.genre === genre).length;
};

const getRank = (watchedFilms) => {
  for (let rank of RANKS) {
    if (watchedFilms <= Object.values(rank)) {
      return Object.keys(rank)[0];
    }
  }
  return ``;
};

const getPopularGenres = (films, genres) => {
  let totalCountGenre = [];
  if (films.length > 0) {
    for (let genre of genres) {
      totalCountGenre.push(countFilmsByGenre(films, genre));
    }
  }
  return totalCountGenre;
};

const getTopGenre = (films, genres) => {
  if (films.length > 0) {
    const maxNum = Math.max.apply(null, getPopularGenres(films, genres));
    const index = getPopularGenres(films, genres).indexOf(maxNum);
    return genres[index];
  }
  return ``;
};

const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

const getTotalDuration = (films) => {
  let duration = 0;
  let totalDuration = films.reduce((num, film) => num + film.runtime, duration);
  return totalDuration;
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
