import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import helmet from 'helmet';
import cors from 'cors';
import { createAppError } from './utils/errors';
import { errorHandler } from './middleware/errorHandler';
import { limiter } from './middleware/rateLimiter';
import { connect } from './config/db';

dotenv.config();

connect();

const app = express();
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.use((req, res, next) => {
  next(createAppError('Not Found', 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
