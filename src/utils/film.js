export const formatDate = (date) => {
  return date.toLocaleDateString(`en-GB`, {day: `numeric`, month: `long`, year: `numeric`});
};

export const formatTime = (minutes) => {
  let time = minutes;
  let hours = time / 60 ^ 0;
  if (hours) {
    let min = time % 60;
    time = hours + ` h ` + min + ` min`;
  } else {
    time = time + ` min`;
  }
  return time;
};

export const sortFilmByDate = (filmA, filmB) => {
  const dateA = new Date(filmA.releaseDay);
  const dateB = new Date(filmB.releaseDay);

  return dateB.getTime() - dateA.getTime();
};

export const sortFilmByRaiting = (filmA, filmB) => {
  return filmB.raiting - filmA.raiting;
};
