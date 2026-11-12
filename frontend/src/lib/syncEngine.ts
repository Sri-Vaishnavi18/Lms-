import { offlineDb } from './db';
import { fetchApi } from './api';

export class SyncEngine {
  /**
   * Enqueues an offline quiz completion into IndexedDB
   */
  public static async enqueueCompletion(item: {
    userId: string;
    moduleId: string;
    score: number;
    isPassed: boolean;
  }) {
    const queueItem = {
      id: `off-sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      clientTimestamp: new Date().toISOString(),
      synced: 0,
    };

    await offlineDb.offlineQueue.add(queueItem);
    console.log('📦 Queued offline completion in IndexedDB:', queueItem.id);

    // Attempt sync if currently online
    if (typeof window !== 'undefined' && navigator.onLine) {
      await this.syncPending();
    }

    return queueItem;
  }

  /**
   * Pushes all pending offline completions to the Node.js backend
   */
  public static async syncPending(): Promise<{ syncedCount: number; errors: number }> {
    if (typeof window === 'undefined' || !navigator.onLine) {
      return { syncedCount: 0, errors: 0 };
    }

    const pending = await offlineDb.offlineQueue.where('synced').equals(0).toArray();

    if (pending.length === 0) {
      return { syncedCount: 0, errors: 0 };
    }

    console.log(`🔄 Syncing ${pending.length} pending offline items to backend...`);

    try {
      const response = await fetchApi('/sync/completions', {
        method: 'POST',
        body: JSON.stringify({ items: pending }),
      });

      // Mark items as synced
      for (const item of pending) {
        await offlineDb.offlineQueue.update(item.id, { synced: 1 });
      }

      console.log('✅ Successfully synced offline queue:', response);
      return { syncedCount: pending.length, errors: 0 };
    } catch (err) {
      console.error('⚠️ Sync failed, items remain queued:', err);
      return { syncedCount: 0, errors: pending.length };
    }
  }

  /**
   * Returns count of items pending upload
   */
  public static async getPendingCount(): Promise<number> {
    return await offlineDb.offlineQueue.where('synced').equals(0).count();
  }
}

