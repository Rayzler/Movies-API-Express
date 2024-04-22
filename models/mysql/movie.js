import connection from "./db.js";

export default class Movie {
  static async getAll({ genre = null } = {}) {
    if (genre) {
      genre = genre.toLowerCase();
      let query = `
        SELECT BIN_TO_UUID(m.id) AS id, m.title, m.year, m.director, m.duration, m.poster, m.rate, g.name AS genre 
        FROM movie m LEFT JOIN movie_genre mg ON m.id = mg.movie_id LEFT JOIN genre g ON mg.genre_id = g.id
        WHERE LOWER(g.name) = ?`;
      const [movies] = await connection.query(query, [genre]);
      return {
        code: movies.length ? 200 : 404,
        response: movies.length ? movies : { error: "No movies found" },
      };
    }

    const [movies] = await connection.query(
      "SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie",
    );

    return {
      code: movies.length ? 200 : 404,
      response: movies.length ? movies : { error: "No movies found" },
    };
  }

  static async getById(id) {
    try {
      const [movies] = await connection.query(
        `SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?)`,
        [id],
      );
      return {
        code: movies.length ? 200 : 404,
        response: movies.length ? movies[0] : { error: "Movie not found" },
      };
    } catch (error) {
      if (error.code === "ER_WRONG_VALUE_FOR_TYPE") {
        return {
          code: 400,
          response: { error: "Invalid ID format" },
        };
      }
      return {
        code: 500,
        response: { error: "Internal server error" },
      };
    }
  }

  static async create(inputMovie) {
    try {
      const newMovie = {
        ...inputMovie,
      };
      const [uuid] = await connection.query("SELECT UUID() AS uuid");
      newMovie.id = uuid[0].uuid;
      await connection.query(
        "INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)",
        [
          newMovie.id,
          newMovie.title,
          newMovie.year,
          newMovie.director,
          newMovie.duration,
          newMovie.poster,
          newMovie.rate || 0,
        ],
      );

      for (const genre of newMovie.genre) {
        const [genreId] = await connection.query(
          "SELECT id FROM genre WHERE name = ?",
          [genre],
        );
        if (genreId.length) {
          await connection.query(
            "INSERT INTO movie_genre (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)",
            [newMovie.id, genreId[0].id],
          );
        } else {
          return {
            code: 400,
            response: { error: "Invalid genre" },
          };
        }
      }

      const { response } = await this.getById(newMovie.id);

      return {
        code: 201,
        response,
      };
    } catch (error) {
      return {
        code: 500,
        response: { error: "Internal server error" },
      };
    }
  }

  static async update(id, updatedMovie) {
    try {
      const { response, code } = await this.getById(id);
      if (code === 404) {
        return { response, code };
      }
      const movie = {
        ...response,
        ...updatedMovie,
      };

      await connection.query(
        "UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?)",
        [
          movie.title,
          movie.year,
          movie.director,
          movie.duration,
          movie.poster,
          movie.rate,
          id,
        ],
      );

      if (updatedMovie.genre) {
        await connection.query(
          "DELETE FROM movie_genre WHERE movie_id = UUID_TO_BIN(?)",
          [id],
        );

        for (const genre of movie.genre) {
          const [genreId] = await connection.query(
            "SELECT id FROM genre WHERE name = ?",
            [genre],
          );
          if (genreId.length) {
            await connection.query(
              "INSERT INTO movie_genre (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)",
              [id, genreId[0].id],
            );
          } else {
            return {
              code: 400,
              response: { error: "Invalid genre" },
            };
          }
        }
      }

      const { response: updatedMovieResponse } = await this.getById(id);

      return {
        code: 200,
        response: updatedMovieResponse,
      };
    } catch (error) {
      return {
        code: 500,
        response: { error: "Internal server error" },
      };
    }
  }

  static async delete(id) {
    try {
      const { response, code } = await this.getById(id);
      if (code === 404) {
        return { response, code };
      }

      await connection.query(
        "DELETE FROM movie_genre WHERE movie_id = UUID_TO_BIN(?)",
        [id],
      );
      await connection.query("DELETE FROM movie WHERE id = UUID_TO_BIN(?)", [
        id,
      ]);

      return {
        code: 200,
        response: { message: "Movie deleted" },
      };
    } catch (error) {
      return {
        code: 500,
        response: { error: "Internal server error" },
      };
    }
  }
}
