export const formatDate = (date) => {
  return date.toLocaleDateString(`en-GB`, {day: `numeric`, month: `long`, year: `numeric`});
};

export const sortFilmByDate = (filmA, filmB) => {
  const dateA = new Date(filmA.releaseDay);
  const dateB = new Date(filmB.releaseDay);

  return dateA.getTime() - dateB.getTime();
};

export const sortFilmByRaiting = (filmA, filmB) => {
  return filmB.raiting - filmA.raiting;
};
