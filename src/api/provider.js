import {nanoid} from "nanoid";
import MoviesModel from "../model/movies.js";

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (Provider.isOnline()) {
      return this._api.getFilms()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptFilmToServer));
          this._store.setItems(items);
          return movies;
        });
    }
    const storeMovies = Object.values(this._store.getItems());
    return Promise.resolve(storeMovies.map(MoviesModel.adaptFilmToClient));
  }

  getComments(movieId) {
    if (Provider.isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          this._store.setItem(movieId);
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItems());
    return Promise.resolve(storeComments);
  }

  updateFilm(movie) {
    if (Provider.isOnline()) {
      return this._api.updateFilm(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptFilmToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._store.setItem(movie.id, MoviesModel.adaptFilmToServer(movie));

    return Promise.resolve(movie);
  }

  addComment(data) {
    const movieId = data.movie.id;
    if (Provider.isOnline()) {
      return this._api.addComment(data)
      .then((newComment) => {
        this._store.setItem(newComment.id, newComment);
        return newComment;
      });
    }

    const localNewCommentId = nanoid();
    const localNewComment = Object.assign({}, movieId, {id: localNewCommentId});

    this._store.setItem(localNewComment.id, localNewComment);

    return Promise.resolve(localNewComment);
  }

  deleteComment(commentId) {
    if (Provider.isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => this._store.removeItem(commentId));
    }

    this._store.removeItem(commentId);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeMovies = Object.values(this._store.getItems());
      return this._api.sync(storeMovies)
        .then((response) => {
          const items = Array.from(createStoreStructure(response.updated));
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
