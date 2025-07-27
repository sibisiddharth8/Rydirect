import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; 
import { protect } from './middleware/auth.middleware';
import path from 'path';

// Route Imports
import authRoutes from './routes/auth.routes';
import { handleRedirect } from './controllers/public.controller';
import publicRoutes from './routes/public.routes'
import batchRoutes from './routes/batch.routes';
import linkRoutes from './routes/link.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';
import utilityRoutes from './routes/utility.routes';
import tagRoutes from './routes/tag.routes';
import profileRoutes from './routes/profile.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set('trust proxy', true);
app.use(express.json());
app.use(cors({ origin: "*" }));

// Serve static files from the 'uploads' directory
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log(`Serving static files from: ${uploadsPath}`);


// --- API & Specific Page Routes ---
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/utility', utilityRoutes);
app.use('/api/batches', protect, batchRoutes);
app.use('/api/links', protect, linkRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/analytics', protect, analyticsRoutes);
app.use('/api/tags', protect, tagRoutes);
app.use('/api/profile', protect, profileRoutes);
app.use('/api/upload', protect, uploadRoutes);

app.get('/all', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/all`);
});

app.get('/:shortCode/qr', (req, res) => {
    const { shortCode } = req.params;
    res.redirect(`${process.env.FRONTEND_URL}/${shortCode}/qr`);
});

// --- GENERIC REDIRECT HANDLER (Must be last) ---
app.get('/:shortCode', handleRedirect);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});