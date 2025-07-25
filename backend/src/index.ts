import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; 
import { protect } from './middleware/auth.middleware';

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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set('trust proxy', true);
app.use(express.json());

// all origin CORS
app.use(cors({
    origin: "*"
}));

app.get('/all', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/all`);
});

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);

// --- PROTECTED ADMIN ROUTES ---
app.use('/api/batches', protect, batchRoutes);
app.use('/api/links', protect, linkRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/analytics', protect, analyticsRoutes);
app.use('/api/utility', protect, utilityRoutes);
app.use('/api/tags', protect, tagRoutes);
app.use('/api/profile', protect, profileRoutes);

// --- GENERIC REDIRECT HANDLER (Must be last) ---
app.get('/:shortCode', handleRedirect);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});