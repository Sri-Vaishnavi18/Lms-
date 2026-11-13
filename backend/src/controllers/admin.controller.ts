import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { ReportService } from '../services/report.service';
import { QRService } from '../services/qr.service';

export class AdminController {
  /**
   * GET /api/v1/admin/compliance-matrix
   */
  public static async getComplianceMatrix(req: Request, res: Response) {
    try {
      const data = await ReportService.getComplianceMatrix();
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('getComplianceMatrix error:', err);
      return res.status(500).json({ error: 'Failed to generate compliance matrix' });
    }
  }

  /**
   * GET /api/v1/admin/users
   * Full user management list with sector, skillTier, status, attendance & completions
   */
  public static async listUsers(req: Request, res: Response) {
    try {
      const { sector, skillTier, status, role, search } = req.query;

      const whereClause: any = {};
      if (sector && typeof sector === 'string') whereClause.sector = sector;
      if (skillTier && typeof skillTier === 'string') whereClause.skillTier = skillTier;
      if (status && typeof status === 'string') whereClause.status = status;
      if (role && typeof role === 'string') whereClause.role = role;
      if (search && typeof search === 'string') {
        whereClause.OR = [
          { fullName: { contains: search } },
          { badgeId: { contains: search } },
          { phoneNumber: { contains: search } },
          { trade: { contains: search } },
        ];
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        include: {
          completions: true,
          attendances: {
            orderBy: { timestamp: 'desc' },
            take: 5,
          },
          submissions: {
            include: {
              assignment: true,
            },
          },
          workerAudits: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const totalModules = await prisma.module.count();

      const transformed = users.map((u) => {
        const passedCompletions = u.completions.filter((c) => c.isPassed);
        const milestonePct = totalModules > 0 ? Math.min(100, Math.round((passedCompletions.length / totalModules) * 100)) : 0;
        return {
          id: u.id,
          fullName: u.fullName,
          phoneNumber: u.phoneNumber,
          badgeId: u.badgeId,
          role: u.role,
          status: u.status,
          sector: u.sector,
          trade: u.trade,
          skillTier: u.skillTier,
          siteLocation: u.siteLocation,
          department: u.department,
          preferredLanguage: u.preferredLanguage,
          createdAt: u.createdAt,
          milestonePercentage: milestonePct,
          totalCompletions: passedCompletions.length,
          totalAssignmentsSubmitted: u.submissions.length,
          latestAttendance: u.attendances[0] || null,
        };
      });

      return res.status(200).json(transformed);
    } catch (err: any) {
      console.error('listUsers error:', err);
      return res.status(500).json({ error: 'Failed to retrieve users' });
    }
  }

  /**
   * GET /api/v1/admin/users/:id
   * Detailed single person breakdown
   */
  public static async getUserDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          completions: {
            include: {
              module: {
                include: { course: true },
              },
            },
          },
          attendances: {
            orderBy: { timestamp: 'desc' },
          },
          submissions: {
            include: {
              assignment: {
                include: { module: true },
              },
            },
          },
          workerAudits: {
            include: {
              supervisor: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const totalModules = await prisma.module.count();
      const passedCount = user.completions.filter((c) => c.isPassed).length;

      return res.status(200).json({
        ...user,
        milestones: {
          totalModules,
          passedModules: passedCount,
          percentage: totalModules > 0 ? Math.round((passedCount / totalModules) * 100) : 0,
          currentSkillTier: user.skillTier,
        },
      });
    } catch (err: any) {
      console.error('getUserDetails error:', err);
      return res.status(500).json({ error: 'Failed to retrieve user details' });
    }
  }

  /**
   * POST /api/v1/admin/users
   * Admin registers new worker / supervisor / admin
   */
  public static async createUser(req: Request, res: Response) {
    try {
      const { fullName, phoneNumber, badgeId, role, sector, trade, skillTier, siteLocation, department, password } = req.body;

      if (!fullName || !phoneNumber || !badgeId) {
        return res.status(400).json({ error: 'Full name, phone number, and badge ID are required' });
      }

      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ phoneNumber }, { badgeId }],
        },
      });

      if (existing) {
        return res.status(409).json({ error: 'User with this phone number or badge ID already exists' });
      }

      const user = await prisma.user.create({
        data: {
          fullName,
          phoneNumber,
          badgeId,
          role: role || 'WORKER',
          status: 'ACTIVE',
          sector: sector || 'CONSTRUCTION',
          trade: trade || 'General Operations',
          skillTier: skillTier || 'UNSKILLED',
          siteLocation: siteLocation || 'Main Plant & Job Site',
          department: department || 'Field Operations',
          password: password || '1234',
        },
      });

      return res.status(201).json({ message: 'User created successfully', user });
    } catch (err: any) {
      console.error('createUser error:', err);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  /**
   * PATCH /api/v1/admin/users/:id
   * Admin edits user properties
   */
  public static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fullName, phoneNumber, badgeId, role, status, sector, trade, skillTier, siteLocation, department } = req.body;

      const updated = await prisma.user.update({
        where: { id },
        data: {
          fullName,
          phoneNumber,
          badgeId,
          role,
          status,
          sector,
          trade,
          skillTier,
          siteLocation,
          department,
        },
      });

      return res.status(200).json({ message: 'User updated successfully', user: updated });
    } catch (err: any) {
      console.error('updateUser error:', err);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  /**
   * POST /api/v1/admin/users/:id/terminate
   * Admin terminates or suspends a worker account
   */
  public static async terminateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status = 'TERMINATED', reason } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: {
          status,
        },
      });

      return res.status(200).json({
        message: `User status changed to ${status}`,
        user: { id: user.id, fullName: user.fullName, status: user.status, reason },
      });
    } catch (err: any) {
      console.error('terminateUser error:', err);
      return res.status(500).json({ error: 'Failed to terminate user' });
    }
  }

  /**
   * POST /api/v1/admin/users/:id/reset-password
   * Admin resets or changes a user's password / PIN
   */
  public static async resetPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const passwordToSet = newPassword || '1234';

      const user = await prisma.user.update({
        where: { id },
        data: {
          password: passwordToSet,
        },
      });

      return res.status(200).json({
        message: `Credentials updated for ${user.fullName}`,
        badgeId: user.badgeId,
        newPassword: passwordToSet,
      });
    } catch (err: any) {
      console.error('resetPassword error:', err);
      return res.status(500).json({ error: 'Failed to reset password' });
    }
  }

  /**
   * GET /api/v1/admin/attendance
   * List site attendance logs
   */
  public static async listAttendance(req: Request, res: Response) {
    try {
      const { date, status } = req.query;
      const where: any = {};
      if (date && typeof date === 'string') where.date = date;
      if (status && typeof status === 'string') where.status = status;

      const records = await prisma.attendance.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: { timestamp: 'desc' },
      });

      return res.status(200).json(records);
    } catch (err: any) {
      console.error('listAttendance error:', err);
      return res.status(500).json({ error: 'Failed to retrieve attendance' });
    }
  }

  /**
   * POST /api/v1/admin/attendance
   * Mark attendance for a worker or bulk list
   */
  public static async markAttendance(req: Request, res: Response) {
    try {
      const { userIds, date, type = 'SHIFT_START', status = 'PRESENT', verifiedBy = 'ADM-9001' } = req.body;
      const targetDate = date || new Date().toISOString().split('T')[0];

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'Array of user IDs required' });
      }

      const results = await Promise.all(
        userIds.map(async (userId: string) => {
          return await prisma.attendance.create({
            data: {
              userId,
              date: targetDate,
              type,
              status,
              verifiedBy,
            },
          });
        })
      );

      return res.status(201).json({
        message: `Attendance marked for ${results.length} workers`,
        count: results.length,
      });
    } catch (err: any) {
      console.error('markAttendance error:', err);
      return res.status(500).json({ error: 'Failed to mark attendance' });
    }
  }

  /**
   * POST /api/v1/admin/courses
   * Admin uploads new course
   */
  public static async createCourse(req: Request, res: Response) {
    try {
      const { title, category, sector, skillTier, description } = req.body;

      if (!title || !category) {
        return res.status(400).json({ error: 'Course title and category are required' });
      }

      const course = await prisma.course.create({
        data: {
          title,
          category,
          sector: sector || 'CONSTRUCTION',
          skillTier: skillTier || 'UNSKILLED',
          description: description || '',
        },
      });

      return res.status(201).json({ message: 'Course created', course });
    } catch (err: any) {
      console.error('createCourse error:', err);
      return res.status(500).json({ error: 'Failed to create course' });
    }
  }

  /**
   * POST /api/v1/admin/modules
   * Admin uploads module (Recorded or Live Session)
   */
  public static async createModule(req: Request, res: Response) {
    try {
      const {
        courseId,
        title,
        durationSeconds,
        sessionType = 'RECORDED',
        videoUrl,
        liveSessionUrl,
        liveStartTime,
        liveInstructor,
        sector,
        skillTier,
        audioTracks,
        assignmentTitle,
        assignmentInstructions,
      } = req.body;

      if (!courseId || !title) {
        return res.status(400).json({ error: 'Course ID and module title are required' });
      }

      const mod = await prisma.module.create({
        data: {
          courseId,
          title,
          durationSeconds: Number(durationSeconds) || 120,
          sessionType,
          videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          liveSessionUrl: liveSessionUrl || null,
          liveStartTime: liveStartTime ? new Date(liveStartTime) : null,
          liveInstructor: liveInstructor || null,
          sector: sector || 'CONSTRUCTION',
          skillTier: skillTier || 'UNSKILLED',
          audioTracks: JSON.stringify(audioTracks || { en: '/audio/en/fire-pass.mp3' }),
        },
      });

      // Optionally attach assignment if provided
      if (assignmentTitle) {
        await prisma.assignment.create({
          data: {
            moduleId: mod.id,
            title: assignmentTitle,
            type: 'PHOTO_PROOF',
            instructions: assignmentInstructions || 'Submit photo proof of practical compliance.',
            requiredProof: 'Clear photo evidence taken on site.',
          },
        });
      }

      return res.status(201).json({ message: 'Module published successfully', module: mod });
    } catch (err: any) {
      console.error('createModule error:', err);
      return res.status(500).json({ error: 'Failed to publish module' });
    }
  }

  /**
   * GET /api/v1/admin/analytics/category-wise
   */
  public static async getCategoryAnalytics(req: Request, res: Response) {
    try {
      const allUsers = await prisma.user.findMany({
        where: { role: 'WORKER' },
        include: { completions: true },
      });

      const sectors = [
        'CONSTRUCTION',
        'SKILLED_TECHNICAL',
        'MANUFACTURING',
        'LOGISTICS',
        'AGRICULTURE',
        'CLEANING_MAINTENANCE',
        'HOSPITALITY_SERVICE',
      ];

      const totalModules = await prisma.module.count();

      const sectorBreakdown = sectors.map((sec) => {
        const workers = allUsers.filter((u) => u.sector === sec);
        const activeWorkers = workers.filter((u) => u.status === 'ACTIVE');
        const totalCompleted = workers.reduce((acc, u) => acc + u.completions.filter((c) => c.isPassed).length, 0);
        const maxPossible = (workers.length * totalModules) || 1;
        const complianceRate = Math.min(100, Math.round((totalCompleted / maxPossible) * 100));

        return {
          sector: sec,
          totalWorkers: workers.length,
          activeWorkers: activeWorkers.length,
          complianceRate,
          skillTiers: {
            unskilled: workers.filter((u) => u.skillTier === 'UNSKILLED').length,
            semiSkilled: workers.filter((u) => u.skillTier === 'SEMI_SKILLED').length,
            skilled: workers.filter((u) => u.skillTier === 'SKILLED').length,
            highlySkilled: workers.filter((u) => u.skillTier === 'HIGHLY_SKILLED').length,
          },
        };
      });

      return res.status(200).json({
        totalWorkers: allUsers.length,
        totalModules,
        sectors: sectorBreakdown,
      });
    } catch (err: any) {
      console.error('getCategoryAnalytics error:', err);
      return res.status(500).json({ error: 'Failed to generate category analytics' });
    }
  }

  /**
   * GET /api/v1/admin/machine-assets
   */
  public static async getMachineAssets(req: Request, res: Response) {
    try {
      const assets = await prisma.machineAsset.findMany();

      const assetsWithQr = await Promise.all(
        assets.map(async (asset) => {
          const payload = QRService.generateMachineAssetPayload(asset.qrCodeId, asset.linkedModuleId);
          const qrDataUrl = await QRService.generateQRCodeDataUrl(payload);
          return {
            ...asset,
            qrCodeDataUrl: qrDataUrl,
          };
        })
      );

      return res.status(200).json(assetsWithQr);
    } catch (err: any) {
      console.error('getMachineAssets error:', err);
      return res.status(500).json({ error: 'Failed to retrieve machine assets' });
    }
  }

  /**
   * POST /api/v1/admin/machine-assets
   */
  public static async createMachineAsset(req: Request, res: Response) {
    try {
      const { name, plantLocation, linkedModuleId } = req.body;

      if (!name || !linkedModuleId) {
        return res.status(400).json({ error: 'Machine name and linked module ID are required' });
      }

      const qrCodeId = `QR-MACH-${Math.floor(10000 + Math.random() * 90000)}`;

      const asset = await prisma.machineAsset.create({
        data: {
          qrCodeId,
          name,
          plantLocation: plantLocation || 'General Shop Floor',
          linkedModuleId,
        },
      });

      const payload = QRService.generateMachineAssetPayload(asset.qrCodeId, asset.linkedModuleId);
      const qrDataUrl = await QRService.generateQRCodeDataUrl(payload);

      return res.status(201).json({
        message: 'Machine registered and QR code generated',
        asset: {
          ...asset,
          qrCodeDataUrl: qrDataUrl,
        },
      });
    } catch (err: any) {
      console.error('createMachineAsset error:', err);
      return res.status(500).json({ error: 'Failed to create machine asset' });
    }
  }

  /**
   * GET /api/v1/admin/audit-reports
   */
  public static async getAuditReports(req: Request, res: Response) {
    try {
      const logs = await ReportService.getAuditLogs();
      return res.status(200).json({
        totalVerifiedRecords: logs.length,
        verifiedAudits: logs,
      });
    } catch (err: any) {
      console.error('getAuditReports error:', err);
      return res.status(500).json({ error: 'Failed to fetch audit reports' });
    }
  }

  /**
   * GET /api/v1/admin/submissions
   * List all submitted assignments for review
   */
  public static async listSubmissions(req: Request, res: Response) {
    try {
      const submissions = await prisma.assignmentSubmission.findMany({
        include: {
          user: true,
          assignment: {
            include: { module: true },
          },
        },
        orderBy: { submittedAt: 'desc' },
      });

      return res.status(200).json(submissions);
    } catch (err: any) {
      console.error('listSubmissions error:', err);
      return res.status(500).json({ error: 'Failed to retrieve assignment submissions' });
    }
  }

  /**
   * PATCH /api/v1/admin/submissions/:id
   * Approve or reject assignment submission
   */
  public static async reviewSubmission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, score, feedback, reviewerName } = req.body;

      const submission = await prisma.assignmentSubmission.update({
        where: { id },
        data: {
          status,
          score: Number(score) || (status === 'APPROVED' ? 100 : 0),
          feedback,
          reviewedBy: reviewerName || 'EHS Safety Team',
        },
        include: { user: true, assignment: true },
      });

      return res.status(200).json({ message: 'Submission reviewed', submission });
    } catch (err: any) {
      console.error('reviewSubmission error:', err);
      return res.status(500).json({ error: 'Failed to review submission' });
    }
  }
}
