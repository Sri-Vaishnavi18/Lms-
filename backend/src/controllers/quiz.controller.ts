import { Request, Response } from 'express';
import prisma from '../db/prisma';

export class QuizController {
  /**
   * POST /api/v1/quizzes/:id/submit
   * Evaluates interactive quiz submission (Spot the Hazard taps, Swipe cards)
   */
  public static async submitQuiz(req: any, res: Response) {
    try {
      const { id } = req.params;
      const { answers, userId } = req.body;
      const effectiveUserId = req.user?.id || userId;

      if (!effectiveUserId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: { module: true },
      });

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const questionData = JSON.parse(quiz.questionData || '{}');
      let score = 0;
      let isPassed = false;
      const feedback: any[] = [];

      if (quiz.type === 'SPOT_THE_HAZARD') {
        // answers: array of { xPercent: number, yPercent: number }
        const userTaps: Array<{ xPercent: number; yPercent: number }> = answers?.taps || [];
        const targets = questionData.hazardTargets || [];
        let hitsCount = 0;

        targets.forEach((target: any) => {
          const matched = userTaps.some((tap) => {
            const distance = Math.sqrt(
              Math.pow(tap.xPercent - target.xPercent, 2) + Math.pow(tap.yPercent - target.yPercent, 2)
            );
            return distance <= (target.radiusPercent || 15);
          });

          if (matched) {
            hitsCount += 1;
            feedback.push({ targetId: target.id, name: target.name, hit: true });
          } else {
            feedback.push({ targetId: target.id, name: target.name, hit: false, tip: target.explanation });
          }
        });

        score = targets.length > 0 ? Math.round((hitsCount / targets.length) * 100) : 100;
        isPassed = score >= 70;
      } else if (quiz.type === 'SWIPE_DECISION') {
        // answers: array of { cardId: string, chosenSafe: boolean }
        const userSwipes: Array<{ cardId: string; chosenSafe: boolean }> = answers?.swipes || [];
        const cards = questionData.swipeCards || [];
        let correctCount = 0;

        cards.forEach((card: any) => {
          const userChoice = userSwipes.find((s) => s.cardId === card.id);
          if (userChoice && userChoice.chosenSafe === card.isSafe) {
            correctCount += 1;
            feedback.push({ cardId: card.id, correct: true });
          } else {
            feedback.push({ cardId: card.id, correct: false, explanation: card.explanation });
          }
        });

        score = cards.length > 0 ? Math.round((correctCount / cards.length) * 100) : 100;
        isPassed = score >= 70;
      } else {
        // Fallback standard score
        score = answers?.score ?? 100;
        isPassed = score >= 70;
      }

      // Record completion
      const completion = await prisma.completion.create({
        data: {
          userId: effectiveUserId,
          moduleId: quiz.moduleId,
          score,
          isPassed,
          isOfflineSynced: false,
        },
      });

      return res.status(200).json({
        message: isPassed ? 'Module Passed Successfully! 🏆' : 'Needs Review - Try Again 🔄',
        score,
        isPassed,
        feedback,
        completionId: completion.id,
      });
    } catch (err: any) {
      console.error('submitQuiz error:', err);
      return res.status(500).json({ error: 'Quiz submission failed' });
    }
  }
}

