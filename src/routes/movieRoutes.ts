import { Router } from 'express';
import { getMovies, getMovie, addMovie, updateMovie, deleteMovie } from '~/controllers/movieController';
import { authMiddleware } from '~/middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getMovies);
router.get('/:id', authMiddleware, getMovie);
router.post('/', authMiddleware, addMovie);
router.put('/:id', authMiddleware, updateMovie);
router.delete('/:id', authMiddleware, deleteMovie);

export default router;
