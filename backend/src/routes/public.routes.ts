import { Router } from 'express';
import { getPublicLinks, getPublicProfile, verifyPassword, getPublicLinkByShortCode, getPublicQrPageData } from '../controllers/public.controller';

const router = Router();
router.get('/profile', getPublicProfile);
router.get('/links', getPublicLinks);
router.post('/verify-password', verifyPassword);
router.get('/link/:shortCode', getPublicLinkByShortCode);
router.get('/qr/:shortCode', getPublicQrPageData);
export default router;