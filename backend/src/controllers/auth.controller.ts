import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { QRService } from '../services/qr.service';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-blue-collar-lms-jwt-key-2026';

export class AuthController {
  /**
   * POST /api/v1/auth/otp/send
   */
  public static async sendOtp(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      let user = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (user && user.status === 'TERMINATED') {
        return res.status(403).json({ error: 'Account has been terminated. Please contact system admin.' });
      }

      if (!user) {
        const autoBadgeId = `BC-${Math.floor(1000 + Math.random() * 9000)}`;
        user = await prisma.user.create({
          data: {
            phoneNumber,
            badgeId: autoBadgeId,
            fullName: `Worker ${autoBadgeId}`,
            role: 'WORKER',
            status: 'ACTIVE',
            sector: 'CONSTRUCTION',
            trade: 'General Operations',
            skillTier: 'UNSKILLED',
          },
        });
      }

      const demoOtp = '1234';

      return res.status(200).json({
        message: 'OTP sent successfully via SMS/WhatsApp',
        phoneNumber,
        demoOtp,
      });
    } catch (err: any) {
      console.error('sendOtp error:', err);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  }

  /**
   * POST /api/v1/auth/register
   * Production-grade self-registration for new students, workers, supervisors
   */
  public static async register(req: Request, res: Response) {
    try {
      let { fullName, phoneNumber, password, role = 'WORKER', sector = 'CONSTRUCTION', trade, preferredLanguage = 'en' } = req.body;

      if (!fullName || !phoneNumber || !password) {
        return res.status(400).json({ error: 'Full name, phone number, and password are required' });
      }

      // Normalize phone number
      phoneNumber = phoneNumber.trim().replace(/\s+/g, '');
      if (!phoneNumber.startsWith('+') && phoneNumber.length === 10) {
        phoneNumber = `+91${phoneNumber}`;
      }

      // Check if phone or variant already exists
      const phoneDigits10 = phoneNumber.slice(-10);
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { phoneNumber },
            { phoneNumber: { contains: phoneDigits10 } },
          ],
        },
      });

      if (existing) {
        return res.status(409).json({ 
          error: `An account with phone number ${existing.phoneNumber} already exists (${existing.fullName}, Badge ID: ${existing.badgeId}). Please log in directly.` 
        });
      }

      const badgePrefix = role === 'ADMIN' ? 'ADM' : role === 'SUPERVISOR' ? 'SUP' : 'BC';
      const autoBadgeId = `${badgePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      const user = await prisma.user.create({
        data: {
          fullName,
          phoneNumber,
          badgeId: autoBadgeId,
          role,
          status: 'ACTIVE',
          password,
          sector,
          trade: trade || 'General Operations',
          skillTier: 'UNSKILLED',
          preferredLanguage,
          siteLocation: 'National Workforce Network',
          department: `${sector.replace('_', ' ')} Division`,
        },
      });

      const token = jwt.sign(
        { id: user.id, role: user.role, badgeId: user.badgeId, phoneNumber: user.phoneNumber },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        message: 'Registration successful! Welcome to LMS 360.',
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          badgeId: user.badgeId,
          role: user.role,
          status: user.status,
          sector: user.sector,
          trade: user.trade,
          skillTier: user.skillTier,
          preferredLanguage: user.preferredLanguage,
          department: user.department,
          siteLocation: user.siteLocation,
        },
      });
    } catch (err: any) {
      console.error('register error:', err);
      return res.status(500).json({ error: `Registration error: ${err.message || 'Failed to complete registration'}` });
    }
  }

  /**
   * POST /api/v1/auth/otp/verify
   */
  public static async verifyOtp(req: Request, res: Response) {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
      }

      if (otp !== '1234') {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      const user = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.status === 'TERMINATED') {
        return res.status(403).json({ error: 'Account has been terminated. Please contact system admin.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, badgeId: user.badgeId, phoneNumber: user.phoneNumber },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        message: 'Authentication successful',
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          badgeId: user.badgeId,
          role: user.role,
          status: user.status,
          sector: user.sector,
          trade: user.trade,
          skillTier: user.skillTier,
          preferredLanguage: user.preferredLanguage,
          department: user.department,
          siteLocation: user.siteLocation,
        },
      });
    } catch (err: any) {
      console.error('verifyOtp error:', err);
      return res.status(500).json({ error: 'Verification failed' });
    }
  }

  /**
   * POST /api/v1/auth/qr-login
   */
  public static async qrLogin(req: Request, res: Response) {
    try {
      const { badgeId, qrPayload } = req.body;

      let targetBadgeId = badgeId;

      if (qrPayload) {
        try {
          const parsed = JSON.parse(qrPayload);
          if (parsed.badgeId) {
            targetBadgeId = parsed.badgeId;
          }
        } catch (e) {
          targetBadgeId = qrPayload;
        }
      }

      if (!targetBadgeId) {
        return res.status(400).json({ error: 'Badge ID or QR payload is required' });
      }

      const user = await prisma.user.findUnique({
        where: { badgeId: targetBadgeId },
      });

      if (!user) {
        return res.status(404).json({ error: `No worker found with Badge ID: ${targetBadgeId}` });
      }

      if (user.status === 'TERMINATED') {
        return res.status(403).json({ error: 'Account has been terminated. Please contact system admin.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, badgeId: user.badgeId, phoneNumber: user.phoneNumber },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        message: 'Badge login successful',
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          badgeId: user.badgeId,
          role: user.role,
          status: user.status,
          sector: user.sector,
          trade: user.trade,
          skillTier: user.skillTier,
          preferredLanguage: user.preferredLanguage,
          department: user.department,
          siteLocation: user.siteLocation,
        },
      });
    } catch (err: any) {
      console.error('qrLogin error:', err);
      return res.status(500).json({ error: 'Badge login failed' });
    }
  }

  /**
   * POST /api/v1/auth/password-login
   * Standard credential login for Admin, Supervisor, or Workers
   */
  public static async passwordLogin(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Badge ID/Phone and password are required' });
      }

      const trimmedId = identifier.trim();
      const phoneDigits10 = trimmedId.replace(/\D/g, '').slice(-10);

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { badgeId: trimmedId },
            { badgeId: trimmedId.toUpperCase() },
            { phoneNumber: trimmedId },
            ...(phoneDigits10.length === 10 ? [{ phoneNumber: { contains: phoneDigits10 } }] : []),
          ],
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.status === 'TERMINATED') {
        return res.status(403).json({ error: 'Account has been terminated by administrator.' });
      }

      // Check password (matches stored password or default demo '1234' / 'admin123')
      if (user.password !== password && password !== '1234' && password !== 'admin123') {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, badgeId: user.badgeId, phoneNumber: user.phoneNumber },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          badgeId: user.badgeId,
          role: user.role,
          status: user.status,
          sector: user.sector,
          trade: user.trade,
          skillTier: user.skillTier,
          preferredLanguage: user.preferredLanguage,
          department: user.department,
          siteLocation: user.siteLocation,
        },
      });
    } catch (err: any) {
      console.error('passwordLogin error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  public static async getMe(req: any, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          completions: {
            include: {
              module: true,
            },
          },
        },
      });

      if (!user) return res.status(404).json({ error: 'User not found' });

      const badgeQR = await QRService.generateQRCodeDataUrl(
        QRService.generateWorkerBadgePayload(user.badgeId, user.phoneNumber)
      );

      return res.status(200).json({
        user: {
          ...user,
          badgeQrCodeUrl: badgeQR,
        },
      });
    } catch (err: any) {
      console.error('getMe error:', err);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }
}
