import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as geoip from 'geoip-lite';

const prisma = new PrismaClient();

// @desc    Redirect short link, track click, and handle splash pages
// @route   GET /{shortCode}
export const handleRedirect = async (req: Request, res: Response) => {
    const { shortCode } = req.params;

    try {
        const now = new Date();
        
        // This query correctly finds the one and only active link
        const link = await prisma.link.findFirst({
            where: {
                shortCode,
                isPaused: false,
                OR: [
                    { activeFrom: null, activeUntil: null },
                    { activeFrom: { lte: now }, activeUntil: null },
                    { activeFrom: null, activeUntil: { gte: now } },
                    { activeFrom: { lte: now }, activeUntil: { gte: now } },
                ],
            }
        });

        if (!link) {
            return res.status(404).send('Active link not found.');
        }

        // --- Click Tracking ---
        (async () => {
            try {
                const ip = req.ip || '';
                const geo = ip ? geoip.lookup(ip) : null;
                await prisma.click.create({
                    data: {
                        linkId: link.id,
                        ipAddress: ip,
                        userAgent: req.get('User-Agent'),
                        referrer: req.get('Referrer'),
                        country: geo?.country,
                    },
                });
                await prisma.link.update({
                    where: { id: link.id },
                    data: { clickCount: { increment: 1 } },
                });
            } catch (trackError) {
                console.error('Failed to track click:', trackError);
            }
        })();

        // --- NEW: DYNAMIC REDIRECT LOGIC ---
        if (link.useSplashPage) {
            // Option 1: Redirect to Frontend Splash Page
            const frontendUrl = process.env.FRONTEND_URL;
            if (!frontendUrl) {
                console.error('FRONTEND_URL is not set in .env file');
                return res.status(500).send('Server configuration error.');
            }
            
            const params = new URLSearchParams({
                to: link.redirectTo,
                design: link.splashPageDesign,
                duration: link.splashPageDuration.toString(),
            });
            
            res.redirect(`${frontendUrl}/redirect?${params.toString()}`);

        } else {
            // Option 2: Perform an Instant Redirect
            res.redirect(302, link.redirectTo);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};


// @desc    Get all public links for "link-in-bio" page
// @route   GET /api/public/links
export const getPublicLinks = async (req: Request, res: Response) => {
    try {
        const admin = await prisma.user.findFirst();
        if (!admin) {
            return res.status(404).json({ error: 'Admin user not configured.' });
        }

        const now = new Date();
        const links = await prisma.link.findMany({
            where: {
                userId: admin.id,
                visibility: 'PUBLIC',
                isPaused: false,
                // NEW: This ensures only currently active links appear on your public page
                OR: [
                    { activeFrom: null, activeUntil: null },
                    { activeFrom: { lte: now }, activeUntil: null },
                    { activeFrom: null, activeUntil: { gte: now } },
                    { activeFrom: { lte: now }, activeUntil: { gte: now } },
                ],
            },
            orderBy: { createdAt: 'asc' },
            select: { name: true, redirectTo: true, shortCode: true },
        });

        res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};