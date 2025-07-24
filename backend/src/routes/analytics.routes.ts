import { Router } from 'express';
import { 
    getClicksOverTime, 
    getGeoBreakdown, 
    getReferrerBreakdown 
} from '../controllers/analytics.controller';

const router = Router();

router.get('/clicks-over-time', getClicksOverTime);
router.get('/geo', getGeoBreakdown);
router.get('/referrers', getReferrerBreakdown);

export default router;