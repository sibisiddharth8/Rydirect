import { Router } from 'express';
import { getClicksOverTime, getGeoData } from '../controllers/analytics.controller';

const router = Router();
router.get('/clicks-over-time', getClicksOverTime);
router.get('/link/:id/geo', getGeoData);
export default router;