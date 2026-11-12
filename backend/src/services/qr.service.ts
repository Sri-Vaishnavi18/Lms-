import QRCode from 'qrcode';

export class QRService {
  /**
   * Generates a Data URL (base64 image) representing a QR code.
   * Can be printed onto badges or equipment stickers.
   */
  public static async generateQRCodeDataUrl(content: string): Promise<string> {
    try {
      return await QRCode.toDataURL(content, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 320,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      throw new Error('QR Code generation failed');
    }
  }

  /**
   * Encodes worker badge payload for 1-second camera login
   */
  public static generateWorkerBadgePayload(badgeId: string, phoneNumber: string): string {
    return JSON.stringify({
      type: 'WORKER_BADGE_LOGIN',
      badgeId,
      phoneNumber,
      timestamp: Date.now(),
    });
  }

  /**
   * Encodes machine asset payload for just-in-time SOP triggers
   */
  public static generateMachineAssetPayload(qrCodeId: string, linkedModuleId: string): string {
    return JSON.stringify({
      type: 'MACHINE_JIT_SOP',
      qrCodeId,
      linkedModuleId,
    });
  }
}

