import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // --- THIS IS THE FIX ---
    // We now save only the relative path to the database.
    const imagePath = `/uploads/${req.file.filename}`;
    
    // We still return the full URL to the frontend for immediate use.
    const fullImageUrl = `${process.env.BACKEND_URL}${imagePath}`;
    
    res.status(201).json({ imageUrl: fullImageUrl, imagePath: imagePath });
};