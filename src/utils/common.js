export const getRandomNumber = (minValue, maxValue) => {
  const randomNumber = Math.floor(Math.random() * maxValue);
  return randomNumber > minValue ? randomNumber : minValue;
};

export const getFilmsInfo = (filmCardId, films) => {
  return films.find(function (item) {
    return +item.id === +filmCardId;
  });
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
