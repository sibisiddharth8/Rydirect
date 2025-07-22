import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get click data over time
// @route   GET /api/analytics/clicks-over-time
export const getClicksOverTime = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    // Further logic to group clicks by day/week/month would go here
    // This is a simplified version for demonstration
    const clicks = await prisma.click.findMany({
        where: { link: { userId } },
        orderBy: { clickedAt: 'asc' },
    });
    res.status(200).json(clicks);
};

// @desc    Get click data by country
// @route   GET /api/analytics/link/:id/geo
export const getGeoData = async (req: Request, res: Response) => {
    const { id } = req.params;
    const geoBreakdown = await prisma.click.groupBy({
        by: ['country'],
        where: { linkId: id },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
    });
    res.status(200).json(geoBreakdown);
};