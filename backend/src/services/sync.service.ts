import prisma from '../db/prisma';

export interface OfflineSyncItemInput {
  id: string; // client-side generated completion UUID
  userId: string;
  moduleId: string;
  score: number;
  isPassed: boolean;
  clientTimestamp: string;
}

export class SyncService {
  /**
   * Processes a batch of offline quiz completions from a worker.
   * Performs idempotent upserts to prevent duplicate scores when syncing multiple times.
   */
  public static async processOfflineCompletions(items: OfflineSyncItemInput[]) {
    const results = [];

    for (const item of items) {
      try {
        const completedDate = new Date(item.clientTimestamp || Date.now());

        // Check if an existing completion already exists for this user and module
        const existing = await prisma.completion.findFirst({
          where: {
            userId: item.userId,
            moduleId: item.moduleId,
          },
        });

        if (existing) {
          // If the new attempt passed or achieved a higher score, update it
          if (item.score > existing.score || (!existing.isPassed && item.isPassed)) {
            const updated = await prisma.completion.update({
              where: { id: existing.id },
              data: {
                score: item.score,
                isPassed: item.isPassed,
                completedAt: completedDate,
                isOfflineSynced: true,
              },
            });
            results.push({ id: item.id, status: 'UPDATED', completionId: updated.id });
          } else {
            results.push({ id: item.id, status: 'IGNORED_LOWER_SCORE', completionId: existing.id });
          }
        } else {
          // Create new completion record
          const created = await prisma.completion.create({
            data: {
              userId: item.userId,
              moduleId: item.moduleId,
              score: item.score,
              isPassed: item.isPassed,
              completedAt: completedDate,
              isOfflineSynced: true,
            },
          });
          results.push({ id: item.id, status: 'CREATED', completionId: created.id });
        }
      } catch (err: any) {
        console.error(`Error syncing item ${item.id}:`, err);
        results.push({ id: item.id, status: 'ERROR', error: err.message });
      }
    }

    return results;
  }
}

