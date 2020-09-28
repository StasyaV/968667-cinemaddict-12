import moment from 'moment';
import {MAX_DESCRIPTION_LENGTH} from "../const.js";

export const getShortDescription = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return description.slice(0, MAX_DESCRIPTION_LENGTH - 1) + `...`;
  }
  return description;
};

export const formatDuration = (minutes) => {
  const duration = moment.duration(minutes, `minutes`);
  const format = minutes > 60 ? `H[h] mm[m]` : `mm[m]`;
  return moment.utc(duration.as(`milliseconds`)).format(format).toString();
};

export const formatReleaseDate = (date, isFullDate = false) => {
  if (isFullDate) {
    return moment(date).format(`DD MMMM YYYY`);
  }

  return moment(date).format(`YYYY`);
};

export const getCommentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:MM`);
};

export const sortFilmByDate = (filmA, filmB) => {
  const dateA = new Date(filmA.releaseDay);
  const dateB = new Date(filmB.releaseDay);

  return dateB.getTime() - dateA.getTime();
};

export const sortFilmByRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};
