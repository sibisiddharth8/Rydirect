import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get aggregated statistics for the dashboard
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const now = new Date();

    try {
        // Count total batches and links in parallel
        const [batchCount, totalLinkCount] = await Promise.all([
            prisma.batch.count({ where: { userId } }),
            prisma.link.count({ where: { userId } }),
        ]);

        // Count links by status in parallel
        const [pausedCount, publicCount, activeCount] = await Promise.all([
            prisma.link.count({ where: { userId, isPaused: true } }),
            prisma.link.count({ where: { userId, visibility: 'PUBLIC' } }),
            // Active links are not paused AND within their active date range (if specified)
            prisma.link.count({
                where: {
                    userId,
                    isPaused: false,
                    OR: [
                        { activeFrom: null, activeUntil: null },
                        { activeFrom: { lte: now }, activeUntil: null },
                        { activeFrom: null, activeUntil: { gte: now } },
                        { activeFrom: { lte: now }, activeUntil: { gte: now } },
                    ],
                },
            }),
        ]);

        // Aggregate total clicks
        const totalClicksAggregation = await prisma.link.aggregate({
            _sum: {
                clickCount: true,
            },
            where: { userId },
        });
        const totalClicks = totalClicksAggregation._sum.clickCount || 0;

        res.status(200).json({
            batches: {
                total: batchCount,
            },
            links: {
                total: totalLinkCount,
                active: activeCount,
                paused: pausedCount,
                public: publicCount,
            },
            clicks: {
                total: totalClicks,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching dashboard stats.' });
    }
};


// @desc    Get top 5 most clicked links
// @route   GET /api/dashboard/top-links
export const getTopLinks = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const topLinks = await prisma.link.findMany({
            where: { userId },
            orderBy: {
                clickCount: 'desc',
            },
            take: 5,
            select: {
                id: true,
                name: true,
                shortCode: true,
                clickCount: true,
            }
        });
        res.status(200).json(topLinks);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching top links.' });
    }
};


// @desc    Get 5 most recently created links
// @route   GET /api/dashboard/recent-links
export const getRecentLinks = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const recentLinks = await prisma.link.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
            select: {
                id: true,
                name: true,
                shortCode: true,
                createdAt: true,
            }
        });
        res.status(200).json(recentLinks);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching recent links.' });
    }
};