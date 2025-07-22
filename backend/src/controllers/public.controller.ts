import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as geoip from 'geoip-lite';

const prisma = new PrismaClient();

// @desc    Redirect short link, track click, and forward to the frontend splash page
// @route   GET /{shortCode}
export const handleRedirect = async (req: Request, res: Response) => {
    const { shortCode } = req.params;

    try {
        const link = await prisma.link.findUnique({
            where: { shortCode },
        });

        if (!link) {
            return res.status(404).send('Link not found.');
        }

        // Check if link is active
        const now = new Date();
        if (link.isPaused ||
            (link.activeFrom && link.activeFrom > now) ||
            (link.activeUntil && link.activeUntil < now)) {
            return res.status(403).send('This link is currently inactive.');
        }

        // Track click in the background
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

        // --- UPDATED REDIRECT LOGIC ---
        // This now redirects to your frontend app's dedicated redirect page.

        // 1. Get your frontend's base URL from environment variables
        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) {
            console.error('FRONTEND_URL is not set in .env file');
            return res.status(500).send('Server configuration error.');
        }
        
        const frontendRedirectPage = `${frontendUrl}/redirect`;

        // 2. URL-encode the final destination to ensure it's passed safely
        const encodedDestination = encodeURIComponent(link.redirectTo);

        // 3. Redirect the user to your frontend page with the destination as a query parameter
        res.redirect(`${frontendRedirectPage}?to=${encodedDestination}`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};


// @desc    Get all public links for "link-in-bio" page
// @route   GET /api/public/links
// NOTE: This function is already correct and requires no changes.
export const getPublicLinks = async (req: Request, res: Response) => {
    try {
        // For a single-user app, we find the first user (the admin)
        const admin = await prisma.user.findFirst();
        if (!admin) {
            return res.status(404).json({ error: 'Admin user not configured.' });
        }

        const links = await prisma.link.findMany({
            where: {
                userId: admin.id,
                visibility: 'PUBLIC',
                isPaused: false,
            },
            orderBy: { createdAt: 'asc' },
            select: { name: true, redirectTo: true, shortCode: true },
        });

        res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};