import { Router } from 'express';
import {
    login,
    forgotPassword,
    resetPasswordWithOtp,
    resetPassword,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password-otp', resetPasswordWithOtp);

// This route is protected and requires a valid JWT
router.post('/reset-password', protect, resetPassword);

export default router;