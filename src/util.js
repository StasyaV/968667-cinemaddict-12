export const render = (container, template) => {
  container.insertAdjacentHTML(`beforeend`, template);
};

export const getRandomNumber = (minValue, maxValue) => {
  let randomNumber = Math.floor(Math.random() * maxValue);
  return randomNumber > minValue ? randomNumber : minValue;
};
