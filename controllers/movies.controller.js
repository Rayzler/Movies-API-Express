import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MoviesController {
  constructor(movie) {
    this.movie = movie;
  }

  getAll = async (req, res) => {
    const { genre } = req.query;
    const { response, code } = await this.movie.getAll({ genre });
    res.status(code).json(response);
  };

  getById = async (req, res) => {
    const { response, code } = await this.movie.getById(req.params.id);
    res.status(code).json(response);
  };

  create = async (req, res) => {
    const result = validateMovie(req.body);

    if (result["error"]) {
      return res
        .status(422)
        .json({ error: JSON.parse(result["error"].message) });
    }

    const { response, code } = await this.movie.create(result["data"]);
    res.status(code).json(response);
  };

  update = async (req, res) => {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (result["error"]) {
      return res
        .status(422)
        .json({ error: JSON.parse(result["error"].message) });
    }

    const { response, code } = await this.movie.update(id, result["data"]);
    res.status(code).json(response);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const { response, code } = await this.movie.delete(id);
    res.status(code).json(response);
  };
}
