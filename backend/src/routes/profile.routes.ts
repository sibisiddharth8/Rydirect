import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';

const router = Router();

router.route('/')
    .get(getProfile)    // <-- Add this line
    .put(updateProfile); // <-- Keep this line

export default router;