import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';
import fs from 'fs-extra';
import path from 'path';

const deleteFile = (fileUrl: string | null | undefined) => {
    if (!fileUrl) return;
    try {
        const filename = path.basename(new URL(fileUrl).pathname);
        const filePath = path.join('uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.removeSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file ${fileUrl}:`, error);
    }
};

// @desc    Get user profile
// @route   GET /api/profile
export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, bio: true, profileImageUrl: true, profileTheme: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get profile.' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { name, bio, profileImageUrl } = req.body; 
    try {
        // --- THIS IS THE FIX ---
        // 1. Find the current user to get the old image URL
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });

        // 2. If a new image is being set and it's different from the old one, delete the old file
        if (existingUser && profileImageUrl !== existingUser.profileImageUrl) {
            deleteFile(existingUser.profileImageUrl);
        }

        // 3. Update the user with the new data
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, bio, profileImageUrl }, 
            select: { id: true, email: true, name: true, bio: true, profileImageUrl: true },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile.' });
    }
};
