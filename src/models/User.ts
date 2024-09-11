import pool from "~/config/db";


export const createUser = async (username: string, hashedPassword: string) => {
  const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
  return result.rows[0];
};

export const findUserByUsername = async (username: string) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};
