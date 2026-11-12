import Dexie, { Table } from 'dexie';

export interface CachedModule {
  id: string;
  courseId: string;
  title: string;
  durationSeconds: number;
  videoUrl: string;
  audioTracks: Record<string, string>;
  quizzes?: any[];
  cachedAt: number;
}

export interface OfflineQueueItem {
  id: string; // client-generated UUID
  userId: string;
  moduleId: string;
  score: number;
  isPassed: boolean;
  clientTimestamp: string;
  synced: number; // 0 = false, 1 = true
}

export class LMSOfflineDatabase extends Dexie {
  cachedModules!: Table<CachedModule, string>;
  offlineQueue!: Table<OfflineQueueItem, string>;

  constructor() {
    super('BlueCollarLMS_OfflineDB');
    this.version(1).stores({
      cachedModules: 'id, courseId, title',
      offlineQueue: 'id, userId, moduleId, synced',
    });
  }
}

export const offlineDb = new LMSOfflineDatabase();

