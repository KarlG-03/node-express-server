import { NextFunction, Request, Response } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie as updateMovieModel,
  deleteMovie as deleteMovieModel,
} from 'models/Movie';
import { AppError, createAppError } from '~/utils/errors';

export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    next(createAppError('Error fetching movies', 500));
  }
};

export const getMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(createAppError('Invalid movie ID', 400));
    }
    const movie = await getMovieById(id);
    if (!movie) {
      return next(createAppError('Movie not found', 404));
    }
    res.json(movie);
  } catch (error) {
    next(createAppError('Error fetching movie', 500));
  }
};

export const addMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, genre, rating } = req.body;
    if (!name || !genre || !rating) {
      return next(createAppError('Missing required fields', 400));
    }
    const movie = await createMovie(name, genre, rating);
    res.status(201).json(movie);
  } catch (error) {
    next(createAppError('Error creating movie', 500));
  }
};

export const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(createAppError('Invalid movie ID', 400));
    }
    const { name, genre, rating } = req.body;
    const movie = await updateMovieModel(id, name, genre, rating);
    if (!movie) {
      return next(createAppError('Movie not found', 404));
    }
    res.json(movie);
  } catch (error) {
    next(createAppError('Error updating movie', 500));
  }
};

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(createAppError('Invalid movie ID', 400));
    }
    await deleteMovieModel(id);
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    next(createAppError('Error deleting movie', 500));
  }
};
