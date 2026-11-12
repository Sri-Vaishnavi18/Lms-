import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';

const router = Router();

router.post('/completions', SyncController.syncOfflineCompletions);

export default router;

