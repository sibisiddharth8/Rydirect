import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage } from '../controllers/upload.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// --- Advanced Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder where files will be saved
  },
  filename: (req, file, cb) => {
    // Create a unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// The route now uses the 'protect' middleware to ensure only logged-in users can upload
router.post('/', protect, upload.single('image'), uploadImage);

export default router;