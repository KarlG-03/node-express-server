import pool from 'config/db';

export interface Movie {
  id: number;
  name: string;
  genre: string;
  rating: number;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  const result = await pool.query('SELECT * FROM movies');
  return result.rows;
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
  return result.rows[0];
};

export const createMovie = async (name: string, genre: string, rating: number): Promise<Movie> => {
  const result = await pool.query('INSERT INTO movies (name, genre, rating) VALUES ($1, $2, $3) RETURNING *', [name, genre, rating]);
  return result.rows[0];
};

export const updateMovie = async (id: number, name: string, genre: string, rating: number): Promise<Movie> => {
  const result = await pool.query('UPDATE movies SET name = $1, genre = $2, rating = $3 WHERE id = $4 RETURNING *', [name, genre, rating, id]);
  return result.rows[0];
};

export const deleteMovie = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM movies WHERE id = $1', [id]);
};
