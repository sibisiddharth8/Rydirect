import { Router } from 'express';
import { getDashboardStats, getTopLinks, getRecentLinks } from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/top-links', getTopLinks);
router.get('/recent-links', getRecentLinks);

export default router;