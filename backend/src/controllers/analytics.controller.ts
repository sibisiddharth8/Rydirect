import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get click data grouped by date for a chart
// @route   GET /api/analytics/clicks-over-time
export const getClicksOverTime = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const clicks = await prisma.click.findMany({
            where: { link: { userId } },
            orderBy: { clickedAt: 'asc' },
            select: { clickedAt: true },
        });

        // Process data to group by day
        const clicksByDay = clicks.reduce((acc, click) => {
            const date = click.clickedAt.toISOString().split('T')[0]; // Get YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.keys(clicksByDay).map(date => ({
            date,
            clicks: clicksByDay[date],
        }));

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// @desc    Get top countries by click count
// @route   GET /api/analytics/geo
export const getGeoBreakdown = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const geoData = await prisma.click.groupBy({
            by: ['country'],
            where: { link: { userId }, country: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        const formattedData = geoData.map(item => ({
            name: item.country,
            clicks: item._count._all,
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// @desc    Get top referrers by click count
// @route   GET /api/analytics/referrers
export const getReferrerBreakdown = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const referrerData = await prisma.click.groupBy({
            by: ['referrer'],
            where: { link: { userId }, referrer: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        const formattedData = referrerData.map(item => ({
            name: item.referrer ? new URL(item.referrer).hostname.replace('www.', '') : 'Direct',
            clicks: item._count._all,
        }));
        
        // This is a simple way to group referrers by domain
        const groupedByDomain = formattedData.reduce((acc, item) => {
             acc[item.name] = (acc[item.name] || 0) + item.clicks;
             return acc;
        }, {} as Record<string, number>);

        const finalData = Object.keys(groupedByDomain).map(name => ({
            name,
            clicks: groupedByDomain[name]
        })).sort((a,b) => b.clicks - a.clicks);


        res.status(200).json(finalData);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};