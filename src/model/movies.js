import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
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

    if (indexFilm === -1) {
      throw new Error(`Can't update unexisting comment`);
    }

    this._films[indexFilm].comments = update.comments.slice();

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const indexFilm = this._films.findIndex((film) => film.id === update.id);

    if (indexFilm === -1) {
      throw new Error(`Can't update unexisting comment`);
    }

    this._films[indexFilm].comments = update.comments.slice();

    this._notify(updateType, update);
  }

  static adaptFilmToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          name: film.film_info.title,
          alternativeName: film.film_info.alternative_title,
          img: film.film_info.poster,
          shortDescription: film.film_info.description,
          fullDescription: film.film_info.description,
          raiting: film.film_info.total_rating,
          year: new Date(film.film_info.release.date).getFullYear(),
          director: film.film_info.director,
          writers: film.film_info.writers.join(`, `),
          actors: film.film_info.actors.join(`, `),
          releaseDay: new Date(film.film_info.release.date),
          ageToWatch: film.film_info.age_rating,
          runtime: film.film_info.runtime,
          country: film.film_info.release.release_country,
          genre: new Set(film.film_info.genre),
          isFavourite: film.user_details.favorite,
          isWatched: film.user_details.already_watched,
          watchlist: film.user_details.watchlist,
          watchingDate: new Date(film.user_details.watching_date)
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;
    return adaptedFilm;
  }

  static adaptCommentsToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          message: comment.comment,
          emoji: comment.emotion
        }
    );

    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          comment: comment.message
        }
    );

    delete adaptedComment.message;

    return adaptedComment;
  }

  static adaptFilmToServer(film) {
    /* eslint-disable camelcase */
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          comments: film.comments,
          film_info: {
            actors: film.actors.split(`, `),
            age_rating: film.ageToWatch,
            alternative_title: film.alternativeName,
            description: film.description,
            director: film.director,
            genre: Array.from(film.genre),
            poster: film.img,
            release: {
              date: film.releaseDay.toISOString(),
              release_country: film.country,
            },
            runtime: film.runtime,
            title: film.name,
            total_rating: film.rating,
            writers: film.writers.split(`, `),
          },
          user_details: {
            already_watched: film.isWatched,
            favorite: film.isFavorite,
            watching_date: (film.watchingDate === null) ? null : film.watchingDate.toISOString(),
            watchlist: film.watchlist,
          }
        }
    );

    delete adaptedFilm.ageToWatch;
    delete adaptedFilm.actors;
    delete adaptedFilm.comments;
    delete adaptedFilm.country;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.runtime;
    delete adaptedFilm.releaseDay;
    delete adaptedFilm.genre;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.img;
    delete adaptedFilm.rating;
    delete adaptedFilm.name;
    delete adaptedFilm.alternativeName;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.writers;

    return adaptedFilm;
  }
}

