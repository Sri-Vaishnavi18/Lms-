import { Router } from 'express';
import { SupervisorController } from '../controllers/supervisor.controller';
import { authenticateToken } from '../middlewares/roleAuth';

const router = Router();

router.get('/crew', SupervisorController.getCrewRoster);
router.post('/toolbox', authenticateToken, SupervisorController.submitToolboxAttendance);
router.post('/practical', authenticateToken, SupervisorController.submitPracticalAudit);

export default router;

