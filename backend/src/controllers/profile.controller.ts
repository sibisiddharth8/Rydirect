import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get user profile
// @route   GET /api/profile
export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, createdAt: true },
    });
    res.status(200).json(user);
};