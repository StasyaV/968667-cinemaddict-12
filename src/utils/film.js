export const formatDate = (date) => {
  return date.toLocaleDateString(`en-GB`, {day: `numeric`, month: `long`, year: `numeric`});
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortFilmByDate = (filmA, filmB) => {
  const dateA = new Date(filmA.releaseDay);
  const dateB = new Date(filmB.releaseDay);

  return dateA.getTime() - dateB.getTime();
};

export const sortFilmByRaiting = (filmA, filmB) => {
  return filmB.raiting - filmA.raiting;
};
