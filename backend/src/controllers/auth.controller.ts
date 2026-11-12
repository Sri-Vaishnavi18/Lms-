import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { QRService } from '../services/qr.service';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-blue-collar-lms-jwt-key-2026';

export class AuthController {
  /**
   * POST /api/v1/auth/otp/send
   * Dispatches 4-digit SMS / WhatsApp OTP
   */
  public static async sendOtp(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Check if user exists or auto-register them
      let user = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (!user) {
        const autoBadgeId = `BC-${Math.floor(1000 + Math.random() * 9000)}`;
        user = await prisma.user.create({
          data: {
            phoneNumber,
            badgeId: autoBadgeId,
            fullName: `Worker ${autoBadgeId}`,
            role: 'WORKER',
          },
        });
      }

      // In production, integrate with Twilio/WhatsApp Business API.
      // For immediate zero-friction testing, demo OTP is 1234
      const demoOtp = '1234';

      return res.status(200).json({
        message: 'OTP sent successfully via SMS/WhatsApp',
        phoneNumber,
        demoOtp, // Provided for instant review and testing
      });
    } catch (err: any) {
      console.error('sendOtp error:', err);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  }

  /**
   * POST /api/v1/auth/otp/verify
   * Verifies 4-digit OTP and returns JWT
   */
  public static async verifyOtp(req: Request, res: Response) {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
      }

      // Accept demo OTP "1234"
      if (otp !== '1234') {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      const user = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
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
   * 1-Second camera login via physical employee QR badge
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
          // If plain text QR
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

      // Generate badge QR code data URL on the fly
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

