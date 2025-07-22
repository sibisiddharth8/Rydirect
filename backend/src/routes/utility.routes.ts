import { Router } from 'express';
import { getQrCode } from '../controllers/utility.controller';

const router = Router();
router.get('/qrcode', getQrCode);
export default router;