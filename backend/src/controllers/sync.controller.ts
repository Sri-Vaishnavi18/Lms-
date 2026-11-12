import { Request, Response } from 'express';
import { SyncService } from '../services/sync.service';

export class SyncController {
  /**
   * POST /api/v1/sync/completions
   * Ingests a batch of offline quiz completions from Worker PWA
   */
  public static async syncOfflineCompletions(req: Request, res: Response) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Payload must contain an array of sync items' });
      }

      const results = await SyncService.processOfflineCompletions(items);

      return res.status(200).json({
        message: 'Offline sync processed successfully',
        processedCount: items.length,
        results,
      });
    } catch (err: any) {
      console.error('syncOfflineCompletions error:', err);
      return res.status(500).json({ error: 'Offline sync failed' });
    }
  }
}

