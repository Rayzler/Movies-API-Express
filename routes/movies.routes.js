import { Router } from "express";
import { MoviesController } from "../controllers/movies.controller.js";

export default function useMovieRouter(app, movie) {
  const router = Router();
  const moviesController = new MoviesController(movie);

  router.get("/", moviesController.getAll);
  router.get("/:id", moviesController.getById);
  router.post("/", moviesController.create);
  router.patch("/:id", moviesController.update);
  router.delete("/:id", moviesController.delete);

  app.use("/movies", router);
}
