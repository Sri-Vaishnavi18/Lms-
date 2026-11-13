import { Request, Response } from 'express';
import prisma from '../db/prisma';

export class ModuleController {
  /**
   * GET /api/v1/modules
   * Retrieves all courses and microlearning modules, optionally filtered by sector, skillTier, sessionType
   */
  public static async getAllModules(req: Request, res: Response) {
    try {
      const { sector, skillTier, sessionType } = req.query;

      const courseWhere: any = {};
      if (sector && typeof sector === 'string') courseWhere.sector = sector;
      if (skillTier && typeof skillTier === 'string') courseWhere.skillTier = skillTier;

      const moduleWhere: any = {};
      if (sessionType && typeof sessionType === 'string') moduleWhere.sessionType = sessionType;
      if (sector && typeof sector === 'string') moduleWhere.sector = sector;
      if (skillTier && typeof skillTier === 'string') moduleWhere.skillTier = skillTier;

      const courses = await prisma.course.findMany({
        where: courseWhere,
        include: {
          modules: {
            where: moduleWhere,
            include: {
              quizzes: true,
              assignments: true,
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
          assignments: m.assignments,
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
   * Single module details with quizzes and assignments
   */
  public static async getModuleById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const moduleItem = await prisma.module.findUnique({
        where: { id },
        include: {
          course: true,
          quizzes: true,
          assignments: {
            include: {
              submissions: {
                orderBy: { submittedAt: 'desc' },
              },
            },
          },
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
        assignments: moduleItem.assignments,
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
      const moduleItem = await prisma.module.findFirst({
        where: {
          sessionType: 'RECORDED',
        },
        include: {
          course: true,
          quizzes: true,
          assignments: true,
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
        assignments: moduleItem.assignments,
      });
    } catch (err: any) {
      console.error('getDailySafetyBite error:', err);
      return res.status(500).json({ error: 'Failed to retrieve daily safety bite' });
    }
  }

  /**
   * POST /api/v1/modules/assignments/:id/submit
   * Worker submits practical / photo assignment
   */
  public static async submitAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params; // assignmentId
      const { userId, proofUrl, notes } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const assignment = await prisma.assignment.findUnique({
        where: { id },
      });

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      const submission = await prisma.assignmentSubmission.create({
        data: {
          assignmentId: id,
          userId,
          proofUrl: proofUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
          notes: notes || '',
          status: 'PENDING',
        },
      });

      return res.status(201).json({
        message: 'Assignment submitted successfully for supervisor review',
        submission,
      });
    } catch (err: any) {
      console.error('submitAssignment error:', err);
      return res.status(500).json({ error: 'Failed to submit assignment' });
    }
  }

  /**
   * GET /api/v1/modules/milestones/:userId
   * Full personalized career milestone & progress checking for worker
   */
  public static async getUserMilestones(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          completions: {
            include: {
              module: true,
            },
          },
          submissions: {
            include: {
              assignment: true,
            },
          },
          attendances: {
            orderBy: { timestamp: 'desc' },
          },
          workerAudits: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Worker not found' });
      }

      const allModules = await prisma.module.findMany({
        where: { sector: user.sector },
        include: { course: true },
      });

      const totalModulesCount = allModules.length || 4;
      const passedCount = user.completions.filter((c) => c.isPassed).length;
      const progressPercent = Math.min(100, Math.round((passedCount / totalModulesCount) * 100));

      // Tier criteria:
      // UNSKILLED: 0-25%
      // SEMI_SKILLED: 26-60%
      // SKILLED: 61-90%
      // HIGHLY_SKILLED: 91-100%
      let calculatedTier = user.skillTier;
      if (progressPercent >= 90) calculatedTier = 'HIGHLY_SKILLED';
      else if (progressPercent >= 60) calculatedTier = 'SKILLED';
      else if (progressPercent >= 25) calculatedTier = 'SEMI_SKILLED';

      const milestones = [
        {
          tier: 'UNSKILLED',
          title: 'Foundational Safety & PPE Induction',
          isUnlocked: true,
          isCompleted: progressPercent >= 25,
          requiredModules: 1,
          description: 'Harness inspection, 3-point contact, hazard spotting canvas pass.',
        },
        {
          tier: 'SEMI_SKILLED',
          title: 'Supervised Equipment Operation',
          isUnlocked: progressPercent >= 25,
          isCompleted: progressPercent >= 60,
          requiredModules: 2,
          description: 'Tool maintenance, machine SOP QR scan, pre-shift circle check.',
        },
        {
          tier: 'SKILLED',
          title: 'Autonomous Precision & Quality 5S',
          isUnlocked: progressPercent >= 60,
          isCompleted: progressPercent >= 90,
          requiredModules: 3,
          description: 'Lockout-Tagout execution, blueprint SOP compliance, photo proof approval.',
        },
        {
          tier: 'HIGHLY_SKILLED',
          title: 'Master Craftsman & Crew Safety Lead',
          isUnlocked: progressPercent >= 90,
          isCompleted: progressPercent >= 100,
          requiredModules: 4,
          description: 'Toolbox talk delivery sign-off, practical audit 100% verified by supervisor.',
        },
      ];

      return res.status(200).json({
        user: {
          id: user.id,
          fullName: user.fullName,
          badgeId: user.badgeId,
          sector: user.sector,
          trade: user.trade,
          skillTier: calculatedTier,
          status: user.status,
          siteLocation: user.siteLocation,
          department: user.department,
        },
        milestoneRoadmap: {
          currentProgressPercent: progressPercent,
          completedCount: passedCount,
          totalAvailableModules: totalModulesCount,
          tiers: milestones,
        },
        recentCompletions: user.completions,
        assignmentSubmissions: user.submissions,
        recentAttendances: user.attendances.slice(0, 5),
        practicalAudits: user.workerAudits,
      });
    } catch (err: any) {
      console.error('getUserMilestones error:', err);
      return res.status(500).json({ error: 'Failed to retrieve milestone roadmap' });
    }
  }
}
