export const render = (container, template) => {
  container.insertAdjacentHTML(`beforeend`, template);
};


export const getRandomNum = function (minValue, maxValue) {
  let randomNum = Math.floor(Math.random() * maxValue);
  return randomNum > minValue ? randomNum : minValue;
};
