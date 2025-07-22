import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create a tag
// @route   POST /api/tags
export const createTag = async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = (req as any).user.id;
    try {
        const tag = await prisma.tag.create({ data: { name, userId } });
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ error: 'Tag already exists or invalid data.' });
    }
};

// @desc    Get all tags
// @route   GET /api/tags
export const getTags = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const tags = await prisma.tag.findMany({ where: { userId } });
    res.status(200).json(tags);
};