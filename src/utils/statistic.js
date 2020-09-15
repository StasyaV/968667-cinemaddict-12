import {RANKS} from "../const.js";

export const countFilmsByGenre = (films, genre) => {
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

  for (let i = 0; i < genres.length; i++) {
    totalCountGenre.push(countFilmsByGenre(films, genres[i]));
  }

  return totalCountGenre;
};

export const getTopGenre = (films, genres) => {
  let maxNum = Math.max.apply(null, getTotalCountGenre(films, genres));
  let index = getTotalCountGenre(films, genres).indexOf(maxNum);

  return genres[index];
};

export const getCountWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched === true).length;
};

export const getTotalDuration = (films) => {
  let totalDuration = 0;
  for (let i = 0; i < films.length; i++) {
    totalDuration += films[i].runtime;
  }

  return totalDuration;
};
