import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
