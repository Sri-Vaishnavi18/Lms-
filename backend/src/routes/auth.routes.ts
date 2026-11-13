import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/roleAuth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/otp/send', AuthController.sendOtp);
router.post('/otp/verify', AuthController.verifyOtp);
router.post('/qr-login', AuthController.qrLogin);
router.post('/password-login', AuthController.passwordLogin);
router.get('/me', authenticateToken, AuthController.getMe);

export default router;
