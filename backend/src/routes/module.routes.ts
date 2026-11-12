import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller';

const router = Router();

router.get('/', ModuleController.getAllModules);
router.get('/daily-bite', ModuleController.getDailySafetyBite);
router.get('/:id', ModuleController.getModuleById);

export default router;

