import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RESERVED_WORDS = [
    'api', 'dashboard', 'links', 'analytics', 'settings', 'profile', 
    'all', 'redirect', 'login', 'logout', 'forgot-password', 'reset-password'
];

const checkActiveDuplicate = async (
  shortCode: string,
  userId: string,
  excludeLinkId: string | null = null
) => {
  const now = new Date();
  const whereClause: any = {
    shortCode,
    userId,
    isPaused: false,
    OR: [
      { activeFrom: null, activeUntil: null },
      { activeFrom: { lte: now }, activeUntil: null },
      { activeFrom: null, activeUntil: { gte: now } },
      { activeFrom: { lte: now }, activeUntil: { gte: now } },
    ],
  };

  if (excludeLinkId) {
    whereClause.id = { not: excludeLinkId };
  }

  const existingActiveLink = await prisma.link.findFirst({ where: whereClause });
  return existingActiveLink;
};


// @desc    Create a new link
// @route   POST /api/links
export const createLink = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    
    // --- THIS IS THE FIX ---
    // Destructure ALL required fields from the request body.
    const { 
        name, shortCode, redirectTo, batchId, visibility, isPaused,
        useSplashPage, splashPageDesign, 
        activeFrom, activeUntil, splashPageDuration 
    } = req.body;

    if (shortCode.includes('/')) {
        return res.status(400).json({ error: 'Short codes cannot contain slashes (/).' });
    }

    // Reserved Word Check
    if (RESERVED_WORDS.includes(shortCode.toLowerCase())) {
        return res.status(400).json({ error: `"${shortCode}" is a reserved word and cannot be used.` });
    }

    // Active Duplicate Check
    if (!isPaused) {
        const duplicate = await checkActiveDuplicate(shortCode, userId);
        if (duplicate) {
            return res.status(409).json({ error: 'Another link with this short code is already active.' });
        }
    }

    try {
        // This part is now correct because all variables are defined.
        const dataToSave: Prisma.LinkCreateInput = {
            user: { connect: { id: userId } },
            name,
            shortCode,
            redirectTo,
            visibility,
            isPaused: Boolean(isPaused),
            useSplashPage: Boolean(useSplashPage),
            splashPageDesign,
            splashPageDuration: Number(splashPageDuration),
            activeFrom: activeFrom ? new Date(activeFrom) : null,
            activeUntil: activeUntil ? new Date(activeUntil) : null,
            ...(batchId && { batch: { connect: { id: batchId } } }),
        };

        const link = await prisma.link.create({
            data: dataToSave,
        });
        res.status(201).json(link);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid data provided.' });
    }
};

// --- updateLink function (already correct) ---
export const updateLink = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { 
        name, shortCode, redirectTo, batchId, visibility, isPaused,
        useSplashPage, splashPageDesign, 
        activeFrom, activeUntil, splashPageDuration 
    } = req.body;

    if (shortCode.includes('/')) {
        return res.status(400).json({ error: 'Short codes cannot contain slashes (/).' });
    }

    if (RESERVED_WORDS.includes(shortCode.toLowerCase())) {
        return res.status(400).json({ error: `"${shortCode}" is a reserved word and cannot be used.` });
    }

    if (!isPaused) {
        const duplicate = await checkActiveDuplicate(shortCode, userId, id);
        if (duplicate) {
            return res.status(409).json({ error: 'Another link with this short code is already active.' });
        }
    }
    
    try {
        const dataToUpdate: Prisma.LinkUpdateInput = {
            name,
            shortCode,
            redirectTo,
            visibility,
            isPaused: Boolean(isPaused),
            useSplashPage: Boolean(useSplashPage),
            splashPageDesign,
            splashPageDuration: Number(splashPageDuration),
            activeFrom: activeFrom ? new Date(activeFrom) : null,
            activeUntil: activeUntil ? new Date(activeUntil) : null,
            ...(batchId ? { batch: { connect: { id: batchId } } } : { batch: { disconnect: true } }),
        };

        const linkToUpdate = await prisma.link.findFirst({
            where: { id, userId }
        });

        if (!linkToUpdate) {
            return res.status(404).json({ error: "Link not found or you don't have permission to edit it." });
        }
        
        await prisma.link.update({ 
            where: { id: id }, 
            data: dataToUpdate 
        });

        res.status(200).json({ message: 'Link updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// --- All other functions (getLinks, deleteLink, etc.) remain the same ---
export const getLinks = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10, search, batchId, visibility } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.LinkWhereInput = {
        userId,
        ...(search && { name: { contains: search as string, mode: 'insensitive' } }),
        ...(batchId && { batchId: batchId as string }),
        ...(visibility && { visibility: visibility as any }),
    };

    try {
        const links = await prisma.link.findMany({
            where,
            skip,
            take: limitNum,
            include: { batch: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        });

        const totalLinks = await prisma.link.count({ where });
        res.status(200).json({
            data: links,
            pagination: {
                total: totalLinks,
                pages: Math.ceil(totalLinks / limitNum),
                currentPage: pageNum,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getLinkById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        const link = await prisma.link.findFirst({
            where: { id, userId },
        });
        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }
        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateLinkStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isPaused } = req.body;
    const userId = (req as any).user.id;

    if (typeof isPaused !== 'boolean') {
        return res.status(400).json({ error: 'isPaused must be a boolean.' });
    }

    try {
        const updatedLink = await prisma.link.updateMany({
            where: { id, userId },
            data: { isPaused },
        });

        if (updatedLink.count === 0) {
            return res.status(404).json({ error: 'Link not found or you do not have permission to edit.' });
        }
        res.status(200).json({ message: `Link has been ${isPaused ? 'paused' : 'resumed'}.` });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteLink = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    try {
        const deletedLink = await prisma.link.deleteMany({
            where: { id, userId },
        });
        if (deletedLink.count === 0) {
            return res.status(404).json({ error: 'Link not found or you do not have permission to delete.' });
        }
        res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const bulkUpdateLinks = async (req: Request, res: Response) => {
    const { action, linkIds, payload } = req.body;
    const userId = (req as any).user.id;

    if (!action || !Array.isArray(linkIds) || linkIds.length === 0) {
        return res.status(400).json({ error: 'Invalid request body.' });
    }
    
    let result;
    try {
        switch (action) {
            case 'delete':
                result = await prisma.link.deleteMany({ where: { id: { in: linkIds }, userId } });
                break;
            case 'pause':
                result = await prisma.link.updateMany({ where: { id: { in: linkIds }, userId }, data: { isPaused: true } });
                break;
            case 'resume':
                result = await prisma.link.updateMany({ where: { id: { in: linkIds }, userId }, data: { isPaused: false } });
                break;
            case 'changeBatch':
                 result = await prisma.link.updateMany({ where: { id: { in: linkIds }, userId }, data: { batchId: payload.batchId } });
                 break;
            default:
                return res.status(400).json({ error: 'Invalid action.' });
        }
        res.status(200).json({ message: 'Bulk action successful.', count: result.count });
    } catch (error) {
         res.status(500).json({ error: 'Server error during bulk action.' });
    }
};