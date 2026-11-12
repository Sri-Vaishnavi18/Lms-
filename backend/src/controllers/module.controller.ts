import { Request, Response } from 'express';
import prisma from '../db/prisma';

export class ModuleController {
  /**
   * GET /api/v1/modules
   * Retrieves all courses and microlearning modules
   */
  public static async getAllModules(req: Request, res: Response) {
    try {
      const courses = await prisma.course.findMany({
        include: {
          modules: {
            include: {
              quizzes: true,
            },
          },
        },
      });

      const parsedCourses = courses.map((course) => ({
        ...course,
        modules: course.modules.map((m) => ({
          ...m,
          audioTracks: JSON.parse(m.audioTracks || '{}'),
          quizzes: m.quizzes.map((q) => ({
            ...q,
            promptAudio: JSON.parse(q.promptAudio || '{}'),
            questionData: JSON.parse(q.questionData || '{}'),
          })),
        })),
      }));

      return res.status(200).json(parsedCourses);
    } catch (err: any) {
      console.error('getAllModules error:', err);
      return res.status(500).json({ error: 'Failed to retrieve modules' });
    }
  }

  /**
   * GET /api/v1/modules/:id
   * Single module details with quizzes
   */
  public static async getModuleById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const moduleItem = await prisma.module.findUnique({
        where: { id },
        include: {
          course: true,
          quizzes: true,
        },
      });

      if (!moduleItem) {
        return res.status(404).json({ error: 'Module not found' });
      }

      return res.status(200).json({
        ...moduleItem,
        audioTracks: JSON.parse(moduleItem.audioTracks || '{}'),
        quizzes: moduleItem.quizzes.map((q) => ({
          ...q,
          promptAudio: JSON.parse(q.promptAudio || '{}'),
          questionData: JSON.parse(q.questionData || '{}'),
        })),
      });
    } catch (err: any) {
      console.error('getModuleById error:', err);
      return res.status(500).json({ error: 'Failed to fetch module' });
    }
  }

  /**
   * GET /api/v1/modules/daily-bite
   * Returns today's mandatory 2-minute safety bite
   */
  public static async getDailySafetyBite(req: Request, res: Response) {
    try {
      // Find EHS priority module or first module
      const moduleItem = await prisma.module.findFirst({
        where: {
          course: {
            category: 'EHS',
          },
        },
        include: {
          course: true,
          quizzes: true,
        },
      });

      if (!moduleItem) {
        return res.status(404).json({ error: 'No daily safety bite available' });
      }

      return res.status(200).json({
        ...moduleItem,
        audioTracks: JSON.parse(moduleItem.audioTracks || '{}'),
        quizzes: moduleItem.quizzes.map((q) => ({
          ...q,
          promptAudio: JSON.parse(q.promptAudio || '{}'),
          questionData: JSON.parse(q.questionData || '{}'),
        })),
      });
    } catch (err: any) {
      console.error('getDailySafetyBite error:', err);
      return res.status(500).json({ error: 'Failed to retrieve daily safety bite' });
    }
  }
}

