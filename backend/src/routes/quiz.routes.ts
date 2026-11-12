import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { authenticateToken } from '../middlewares/roleAuth';

const router = Router();

// Allow authenticated submissions or direct submissions with userId
router.post('/:id/submit', authenticateToken, QuizController.submitQuiz);

export default router;

