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

// export const sortFilmByDate = () => {
//   
// };

export const sortFilmByRaiting = (films) => {
  const sortedFilms = films.slice();

  sortedFilms.sort(function (a, b) {
    return b.raiting - a.raiting;
  });

  console.log(sortedFilms);
  return sortedFilms;
};
