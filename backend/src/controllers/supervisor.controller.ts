import { Request, Response } from 'express';
import prisma from '../db/prisma';

export class SupervisorController {
  /**
   * GET /api/v1/supervisor/crew
   * Retrieves active shift crew roster with real-time compliance status
   */
  public static async getCrewRoster(req: Request, res: Response) {
    try {
      const workers = await prisma.user.findMany({
        where: { role: 'WORKER' },
        include: {
          completions: {
            include: {
              module: {
                select: { title: true },
              },
            },
          },
          workerAudits: true,
        },
      });

      const totalModules = await prisma.module.count();

      const roster = workers.map((w) => {
        const passedModules = w.completions.filter((c) => c.isPassed).length;
        const isFullyCertified = totalModules > 0 && passedModules >= totalModules;
        const hasPassedPractical = w.workerAudits.some((a) => a.passed);

        return {
          id: w.id,
          fullName: w.fullName,
          badgeId: w.badgeId,
          phoneNumber: w.phoneNumber,
          department: w.department,
          siteLocation: w.siteLocation,
          passedModulesCount: passedModules,
          totalModulesCount: totalModules,
          isFullyCertified,
          hasPassedPractical,
        };
      });

      return res.status(200).json({
        totalCrew: roster.length,
        certifiedCrew: roster.filter((w) => w.isFullyCertified).length,
        pendingCrew: roster.filter((w) => !w.isFullyCertified).length,
        roster,
      });
    } catch (err: any) {
      console.error('getCrewRoster error:', err);
      return res.status(500).json({ error: 'Failed to retrieve crew roster' });
    }
  }

  /**
   * POST /api/v1/supervisor/toolbox
   * Bulk marks morning Toolbox Talk attendance for assembled crew
   */
  public static async submitToolboxAttendance(req: any, res: Response) {
    try {
      const { moduleId, workerIds, notes } = req.body;
      const supervisorId = req.user?.id || 'supervisor-default';

      if (!moduleId || !workerIds || !Array.isArray(workerIds)) {
        return res.status(400).json({ error: 'Module ID and array of worker IDs are required' });
      }

      const results = [];

      for (const workerId of workerIds) {
        // Record completion for each worker in the group
        const comp = await prisma.completion.create({
          data: {
            userId: workerId,
            moduleId,
            score: 100, // Group attendance certified by supervisor
            isPassed: true,
            isOfflineSynced: false,
          },
        });
        results.push(comp.id);
      }

      return res.status(200).json({
        message: `Group attendance confirmed for ${workerIds.length} crew members!`,
        recordedCompletionsCount: results.length,
        supervisorId,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('submitToolboxAttendance error:', err);
      return res.status(500).json({ error: 'Failed to submit toolbox talk attendance' });
    }
  }

  /**
   * POST /api/v1/supervisor/practical
   * Records on-site physical observation audit with supervisor digital signature
   */
  public static async submitPracticalAudit(req: any, res: Response) {
    try {
      const { workerId, checklistName, passed, notes, signatureUrl } = req.body;
      const supervisorId = req.user?.id || 'supervisor-default';

      if (!workerId || !checklistName) {
        return res.status(400).json({ error: 'Worker ID and checklist name are required' });
      }

      const audit = await prisma.practicalAudit.create({
        data: {
          workerId,
          supervisorId,
          checklistName,
          passed: passed ?? true,
          notes: notes || '',
          signatureUrl: signatureUrl || 'digital-signature-approved',
        },
      });

      return res.status(200).json({
        message: 'Practical on-site verification recorded successfully',
        audit,
      });
    } catch (err: any) {
      console.error('submitPracticalAudit error:', err);
      return res.status(500).json({ error: 'Failed to record practical audit' });
    }
  }
}

