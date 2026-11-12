import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

router.get('/compliance-matrix', AdminController.getComplianceMatrix);
router.get('/machine-assets', AdminController.getMachineAssets);
router.post('/machine-assets', AdminController.createMachineAsset);
router.get('/audit-reports', AdminController.getAuditReports);

export default router;

