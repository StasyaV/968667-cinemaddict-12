import {getRandomNumber} from "../util.js";

const descriptionList = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const filmNamesList = [`The Dance of Life`, `Sagebrush Trail`, `The Man with the Golden Arm`, `Santa Claus Conquers the Martians`, `Popeye the Sailor Meets Sindbad the Sailor`];
const filmPosters = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const filmGenres = [`Musical`, `Comedy`, `Drama`, `Cartoon`, `Western`, `Horror`, `Fantasy`];
const emotions = [`smile`, `sleeping`, `puke`, `angry`];
const names = [`Игорь`, `Андрей`, `Саша`, `Дима`, `Валя`, `Коля`, `Евгений`, `Марина`, `Лера`, `Лора`, `Вика`, `Миша`];
const countriesList = [`USA`, `Russia`, `Ukraine`, `Germany`, `Poland`, `Sweden`, `Norway`];

const generateDescriptionLength = () => {
  return getRandomNumber(1, 5);
};

const generateDescription = () => {
  let description = ``;
  for (let i = 0; i < generateDescriptionLength(); i++) {
    description += descriptionList[i];
  }
  return description;
};

export const getComment = () => {
  const comment = {
    emoji: `/images/emoji/` + emotions[getRandomNumber(0, emotions.length)] + `.png`,
    message: descriptionList[getRandomNumber(0, descriptionList.length)],
    author: names[getRandomNumber(0, names)],
    date: `2019/12/31 23:59`
  };
  return comment;
};

export const comments = new Array(getRandomNumber(0, 5)).fill().map(getComment);

export const getFilm = (value, index) => {
  const film = {
    name: filmNamesList[getRandomNumber(0, filmNamesList.length)],
    img: `/images/posters/` + filmPosters[getRandomNumber(0, filmPosters.length)],
    shortDescription: generateDescription(),
    fullDescription: generateDescription(),
    comments: comments.length,
    raiting: getRandomNumber(0, 10),
    year: getRandomNumber(1929, 2000),
    director: names[getRandomNumber(0, names)],
    writers: names[getRandomNumber(0, names)],
    actors: names[getRandomNumber(0, names)],
    releaseDay: `01 April 1995`,
    ageToWatch: getRandomNumber(0, 18) + `+`,
    runtime: `1h 36m`,
    country: countriesList[getRandomNumber(0, countriesList.length)],
    genre: filmGenres[getRandomNumber(0, filmGenres.length)],
    id: index,
    isFavourite: Boolean(getRandomNumber(0, 2)),
    isWatched: Boolean(getRandomNumber(0, 2)),
    watchlist: Boolean(getRandomNumber(0, 2))
  };
  return film;
};
