import moment from 'moment';

export const formatDuration = (minutes) => {
  const duration = moment.duration(minutes, `minutes`);
  const format = minutes > 60 ? `H[h] mm[m]` : `mm[m]`;
  return moment.utc(duration.as(`milliseconds`)).format(format).toString();
};

export const formatReleaseDate = (date, isFullDate = false) => {
  if (isFullDate) {
    return moment(date).format(`DD MMMM YYYY`);
  } else {
    return moment(date).format(`YYYY`);
  }
};

export const getCommentDate = (date) => {
  return moment(date).fromNow();
};

export const sortFilmByDate = (filmA, filmB) => {
  const dateA = new Date(filmA.releaseDay);
  const dateB = new Date(filmB.releaseDay);

  return dateB.getTime() - dateA.getTime();
};

export const sortFilmByRaiting = (filmA, filmB) => {
  return filmB.raiting - filmA.raiting;
};
