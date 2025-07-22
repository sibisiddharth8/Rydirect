import { Router } from 'express';
import { getPublicLinks } from '../controllers/public.controller';

const router = Router();
router.get('/links', getPublicLinks);
export default router;