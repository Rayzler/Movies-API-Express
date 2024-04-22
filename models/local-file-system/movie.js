import { readJSON } from "../../utils.js";
import { randomUUID } from "node:crypto";

const movies = readJSON("./movies.json");
export default class Movie {
  static async getAll({ genre = null } = {}) {
    if (genre) {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
      );
      return {
        code: filteredMovies.length ? 200 : 404,
        response: filteredMovies.length
          ? filteredMovies
          : { error: "No movies found" },
      };
    }
    return {
      code: movies.length ? 200 : 404,
      response: movies.length ? movies : { error: "No movies found" },
    };
  }

  static async getById(id) {
    const movie = movies.find((movie) => movie.id === id);
    if (!movie) {
      return { code: 404, response: { error: "Movie not found" } };
    }
    return { code: 200, response: movie };
  }

  static async create(newMovie) {
    const movie = {
      id: randomUUID(),
      ...newMovie,
    };
    movies.push(movie);
    return { code: 201, response: movie };
  }

  static async update(id, updatedMovie) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
      return { code: 404, response: { error: "Movie not found" } };
    }
    const movie = {
      ...movies[movieIndex],
      ...updatedMovie,
    };
    movies[movieIndex] = movie;
    return {
      code: 200,
      response: movie,
    };
  }

  static async delete(id) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
      return { code: 404, response: { error: "Movie not found" } };
    }
    movies.splice(movieIndex, 1);
    return { code: 200, response: { message: "Movie deleted" } };
  }
}
