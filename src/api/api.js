import MoviesModel from "../model/movies-model.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((movies) => movies.map(MoviesModel.adaptFilmToClient));
  }

  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then(Api.toJSON);
  }

  updateFilm(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptFilmToServer(movie)),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON)
    .then((filmFromClient) => MoviesModel.adaptFilmToClient(filmFromClient, movie));
  }

  addComment(data) {
    return this._load({
      url: `comments/${+data.movie.id}`,
      method: Method.POST,
      body: JSON.stringify(data.comment),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((film) => MoviesModel.adaptFilmForAddComment(film));
  }

  deleteComment(data) {
    return this._load({
      url: `comments/${data.commentIdToDelete}`,
      method: Method.DELETE
    });
  }

  sync(movies) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(movies),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
