import { Request, Response } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie as updateMovieModel,
  deleteMovie as deleteMovieModel,
} from 'models/Movie';

export const getMovies = async (req: Request, res: Response) => {
  const movies = await getAllMovies();
  res.json(movies);
};

export const getMovie = async (req: Request, res: Response) => {
  const movie = await getMovieById(parseInt(req.params.id));
  res.json(movie);
};

export const addMovie = async (req: Request, res: Response) => {
  const { name, genre, rating } = req.body;
  const movie = await createMovie(name, genre, rating);
  res.json(movie);
};

export const updateMovie = async (req: Request, res: Response) => {
  const { name, genre, rating } = req.body;
  const movie = await updateMovieModel(parseInt(req.params.id), name, genre, rating);
  res.json(movie);
};

export const deleteMovie = async (req: Request, res: Response) => {
  await deleteMovieModel(parseInt(req.params.id));
  res.json({ message: 'Movie deleted' });
};
