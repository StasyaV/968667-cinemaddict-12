import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    const indexFilm = this._films.findIndex((film) => film.id === update.id);
    const indexComment = this._films[indexFilm].comments.findIndex((comment) => comment.id === update.id);

    console.log(this._films[indexFilm].comments);

    if (indexFilm === -1 || indexComment === -1) {
      throw new Error(`Can't update unexisting comment`);
    }

    this._films[indexFilm].comments = [
      ...this._films[indexFilm].comments.slice(0, indexComment),
      update,
      ...this._films[indexFilm].comments.slice(indexComment + 1)
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const indexFilm = this._films.findIndex((film) => film.id === update.id);
    const indexComment = this._films[indexFilm].comments.findIndex((comment) => comment.id === update.id);

    console.log(this._films[indexFilm].comments);
    
    if (indexFilm === -1 || indexComment === -1) {
      throw new Error(`Can't update unexisting comment`);
    }

    this._films[indexFilm].comments = [
      ...this._films[indexFilm].comments.slice(0, indexComment),
      update,
      ...this._films[indexFilm].comments.slice(indexComment + 1)
    ];

    this._notify(updateType, update);
  }
}

