import { Router } from 'express';
import { createTag, getTags } from '../controllers/tag.controller';

const router = Router();
router.route('/').post(createTag).get(getTags);
export default router;