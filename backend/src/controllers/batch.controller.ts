import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import prisma from '../lib/prisma';

// @desc    Create a new batch
// @route   POST /api/batches
export const createBatch = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const userId = (req as any).user.id;

    try {
        const batch = await prisma.batch.create({
            data: { name, description, userId },
        });
        res.status(201).json(batch);
    } catch (error) {
        res.status(400).json({ error: 'Batch with this name already exists or invalid data.' });
    }
};

// @desc    Get all batches with link counts and pagination
// @route   GET /api/batches
export const getBatches = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const batches = await prisma.batch.findMany({
            where: { userId },
            skip,
            take: limit,
            include: {
                _count: {
                    select: { links: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const totalBatches = await prisma.batch.count({ where: { userId } });
        res.status(200).json({
            data: batches,
            pagination: {
                total: totalBatches,
                pages: Math.ceil(totalBatches / limit),
                currentPage: page,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get a single batch by ID
// @route   GET /api/batches/:id
export const getBatchById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        const batch = await prisma.batch.findFirst({
            where: { id, userId },
            include: { links: true }, // Include all links in this batch
        });
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        res.status(200).json(batch);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update a batch
// @route   PUT /api/batches/:id
export const updateBatch = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = (req as any).user.id;

    try {
        const batch = await prisma.batch.updateMany({
            where: { id, userId },
            data: { name, description },
        });
        if (batch.count === 0) {
            return res.status(404).json({ error: 'Batch not found or you do not have permission to edit.' });
        }
        res.status(200).json({ message: 'Batch updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete a batch
// @route   DELETE /api/batches/:id
export const deleteBatch = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        const batch = await prisma.batch.deleteMany({
            where: { id, userId },
        });
        if (batch.count === 0) {
            return res.status(404).json({ error: 'Batch not found or you do not have permission to delete.' });
        }
        res.status(200).json({ message: 'Batch deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTopBatches = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const topBatches = await prisma.batch.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { links: true },
                },
            },
            orderBy: {
                links: {
                    _count: 'desc',
                },
            },
            take: 3,
        });
        res.status(200).json(topBatches);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching top batches.' });
    }
};