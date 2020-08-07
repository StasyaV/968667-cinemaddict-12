import {getRandomNum} from "../util.js";

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
  const maxLengthDescription = 5;
  const minLengthDescription = 1;
  return getRandomNum(minLengthDescription, maxLengthDescription);
};

const generateDescription = () => {
  let description = ``;
  for (let i = 0; i < generateDescriptionLength(); i++) {
    description += descriptionList[i];
  }
  return description;
};

export const getCommentObj = function () {
    const commentObj = {
      emoji: `/images/emoji/` + emotions[getRandomNum(0, emotions.length)] + `.png`,
      message: descriptionList[getRandomNum(0, descriptionList.length)],
      author: names[getRandomNum(0, names)],
      date: `2019/12/31 23:59`
    };
  return commentObj;
};

export const commentsArray = new Array(getRandomNum(0, 5)).fill().map(getCommentObj);

export const getFilmObj = (value, index) => {
  const filmObj = {
    name: filmNamesList[getRandomNum(0, filmNamesList.length)],
    img: `/images/posters/` + filmPosters[getRandomNum(0, filmPosters.length)],
    shortDescription: generateDescription(),
    fullDescription: generateDescription(),
    comments: commentsArray.length,
    raiting: getRandomNum(0, 10),
    year: getRandomNum(1929, 1964),
    director: names[getRandomNum(0, names)],
    writers: names[getRandomNum(0, names)],
    actors: names[getRandomNum(0, names)],
    releaseDay: `01 April 1995`,
    ageToWatch: getRandomNum(0, 18) + `+`,
    runtime: `1h 36m`,
    country: countriesList[getRandomNum(0, countriesList.length)],
    genre: filmGenres[getRandomNum(0, filmGenres.length)],
    id: index
  };
  return filmObj;
};

export const createFilmCard = (card) => {
  const {name, shortDescription, img, comments, raiting, year, runtime, genre, id} = card;

  return `<article class="film-card" id=${id}>
  <h3 class="film-card__title">${name}</h3>
  <p class="film-card__rating">${raiting}</p>
  <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${runtime}</span>
    <span class="film-card__genre">${genre}</span>
  </p>
  <img src=${img} alt="" class="film-card__poster">
  <p class="film-card__description">${shortDescription}</p>
  <a class="film-card__comments">${comments} comments</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
  </form>
</article>`;
};
