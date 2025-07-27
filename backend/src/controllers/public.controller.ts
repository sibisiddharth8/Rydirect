import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as geoip from 'geoip-lite';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// @desc    Redirect short link, track click, and handle splash pages
// @route   GET /{shortCode}
export const handleRedirect = async (req: Request, res: Response) => {

    const { shortCode } = req.params;
    const now = new Date();
    
    // This query finds the link, regardless of its active status
    const link = await prisma.link.findFirst({
        where: { shortCode }
    });

    // Case 1: The link does not exist at all
    if (!link) {
        // Redirect to the 404 page on your frontend
        return res.redirect(`${process.env.FRONTEND_URL}/404`);
    }

    // Case 2: The link exists but is inactive (paused or outside its date range)
    const isActive = !link.isPaused &&
        (!link.activeFrom || new Date(link.activeFrom) <= now) &&
        (!link.activeUntil || new Date(link.activeUntil) >= now);

    if (!isActive) {
        // Redirect to the inactive link page on your frontend
        return res.redirect(`${process.env.FRONTEND_URL}/inactive`);
    }
    
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

        if (link.visibility === 'PRIVATE' && link.password) {
        const frontendUrl = process.env.FRONTEND_URL;
        // Redirect to a password entry page on the frontend
        return res.redirect(`${frontendUrl}/unlock?link=${link.shortCode}`);
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
                shortCode: link.shortCode,
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

        const links = await prisma.link.findMany({
            where: {
                userId: admin.id,
                visibility: 'PUBLIC',
                isPaused: false,
            },
            orderBy: { createdAt: 'asc' },
            // --- THIS IS THE FIX ---
            // We now select all the fields the frontend needs to display the link correctly.
            select: { 
                id: true,
                name: true, 
                redirectTo: true, 
                shortCode: true,
                iconUrl: true,
                companyName: true,
                companyLogoUrl: true,
                heroImageUrl: true,
                ctaText: true,
            },
        });

        res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};


// --- NEW FUNCTION to verify the password ---
// @desc    Verify password for a private link
// @route   POST /api/public/verify-password
export const verifyPassword = async (req: Request, res: Response) => {
    const { shortCode, password } = req.body;
    if (!shortCode || !password) {
        return res.status(400).json({ error: 'Short code and password are required.' });
    }
    
    try {
        const link = await prisma.link.findFirst({ where: { shortCode, visibility: 'PRIVATE' } });
        
        if (!link || !link.password) {
            return res.status(404).json({ error: 'Protected link not found.' });
        }
        
        const isMatch = await bcrypt.compare(password, link.password);
        
        if (isMatch) {
            // If password is correct, send back the destination URL
            res.status(200).json({ redirectTo: link.redirectTo });
        } else {
            res.status(401).json({ error: 'Invalid password.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

export const getPublicProfile = async (req: Request, res: Response) => {
    try {
        // Since it's a single-user app, we find the first (and only) user
        const adminUser = await prisma.user.findFirst({
            select: {
                name: true,
                bio: true,
                profileImageUrl: true,
                profileTheme: true,
            }
        });

        if (!adminUser) {
            return res.status(404).json({ error: 'Public profile not configured.' });
        }
        res.status(200).json(adminUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching public profile.' });
    }
};

export const getPublicLinkByShortCode = async (req: Request, res: Response) => {
    const { shortCode } = req.params;
    try {
        const link = await prisma.link.findFirst({
            where: { shortCode, isPaused: false, visibility: { not: 'PRIVATE' } },
            // Select only the fields needed for the splash page
            select: {
                name: true,
                redirectTo: true,
                heroImageUrl: true,
                ctaText: true,
                companyName: true,
                companyLogoUrl: true,
            }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link not found.' });
        }
        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

export const getPublicQrPageData = async (req: Request, res: Response) => {
    const { shortCode } = req.params;
    try {
        // Fetch user and link data in parallel
        const [user, link] = await Promise.all([
            prisma.user.findFirst({
                select: { name: true, profileImageUrl: true }
            }),
            prisma.link.findFirst({
                where: { shortCode, isPaused: false },
                select: { name: true, redirectTo: true, iconUrl: true }
            })
        ]);

        if (!link) {
            return res.status(404).json({ error: 'Link not found.' });
        }

        res.status(200).json({ user, link });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};