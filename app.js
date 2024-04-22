import express, { json } from "express";
import useMovieRouter from "./routes/movies.routes.js";
import cors from "./middlewares/cors.js";

export default function createApp({ Movie }) {
  const app = express();
  app.disable("x-powered-by");

  // Middlewares
  app.use(json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  useMovieRouter(app, Movie);

  const PORT = process.env.PORT || 1234;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}
