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

export const getRank = (watchedFilms) => {
  for (let i = 0; i < RANKS.length; i++) {
    if (watchedFilms <= Object.values(RANKS[i])) {
      return Object.keys(RANKS[i])[0];
    }
  }
  return ``;
};

export const getTotalCountGenre = (films, genres) => {
  let totalCountGenre = [];
  if (films.length > 0) {
    for (let i = 0; i < genres.length; i++) {
      totalCountGenre.push(countFilmsByGenre(films, genres[i]));
    }
  }
  return totalCountGenre;
};

export const getTopGenre = (films, genres) => {
  if (films.length > 0) {
    let maxNum = Math.max.apply(null, getTotalCountGenre(films, genres));
    let index = getTotalCountGenre(films, genres).indexOf(maxNum);
    return genres[index];
  }
  return ``;
};

export const getCountWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched === true);
};

export const getTotalDuration = (films) => {
  let totalDuration = 0;
  for (let i = 0; i < films.length; i++) {
    totalDuration += films[i].runtime;
  }

  return totalDuration;
};

export const getFilmStats = (films, genres) => {
  const watchedFilms = getCountWatchedFilms(films);
  const genresCount = getTotalCountGenre(watchedFilms, genres);
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
