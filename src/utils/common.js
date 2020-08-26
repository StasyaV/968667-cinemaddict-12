export const getRandomNumber = (minValue, maxValue) => {
  let randomNumber = Math.floor(Math.random() * maxValue);
  return randomNumber > minValue ? randomNumber : minValue;
};

export const getFilmsInfo = (filmCardId, films) => {
  return films.find(function (item) {
    return +item.id === +filmCardId;
  });
};
