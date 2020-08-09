const createMenuItemTemplate = (filter) => {
  const {
    name,
    count
  } = filter;

  return (
    `<a href="#${name}" class="main-navigation__item main-navigation__item--active">${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`
  );
};

export const createMenuTemplate = (filterItems) => {
  const menuItemsTemplate = filterItems
    .map((filter) => createMenuItemTemplate(filter))
    .join(``);

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    ${menuItemsTemplate}
  </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
