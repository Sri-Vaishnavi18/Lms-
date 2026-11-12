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
        generatedAt: new Date().toISOString(),
        records: logs,
      });
    } catch (err: any) {
      console.error('getAuditReports error:', err);
      return res.status(500).json({ error: 'Failed to fetch audit reports' });
    }
  }
}

