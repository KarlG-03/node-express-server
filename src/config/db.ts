import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connect = () => {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      setTimeout(connect, 5000);
    } else {
      console.log('Connected to PostgreSQL');
      release();

      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        setTimeout(connect, 5000);
      });
    }
  });
};

export const disconnect = async () => {
  try {
    await pool.end();
    // console.log('Disconnected from PostgreSQL');
  } catch (error) {
    console.error('Error disconnecting from PostgreSQL', error);
  }
};

export default pool;
