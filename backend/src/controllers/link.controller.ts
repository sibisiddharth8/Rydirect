import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create a new link
// @route   POST /api/links
export const createLink = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { 
        name, shortCode, redirectTo, batchId, visibility, isPaused,
        useSplashPage, splashPageDesign, 
        activeFrom, activeUntil, splashPageDuration 
    } = req.body;

    // --- Start of new validation logic ---
    if (!isPaused) {
        const duplicate = await checkActiveDuplicate(shortCode, userId);
        if (duplicate) {
            return res.status(409).json({ error: 'Another link with this short code is already active.' });
        }
    }
    // --- End of new validation logic ---

    try {
        // Explicitly construct the data object with correct types
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

// --- NEW, ROBUST updateLink FUNCTION ---
export const updateLink = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { 
        name, shortCode, redirectTo, batchId, visibility, isPaused,
        useSplashPage, splashPageDesign, 
        activeFrom, activeUntil, splashPageDuration 
    } = req.body;

    // Validation logic for active duplicates remains the same
    if (!isPaused) {
        const duplicate = await checkActiveDuplicate(shortCode, userId, id);
        if (duplicate) {
            return res.status(409).json({ error: 'Another link with this short code is already active.' });
        }
    }
    
    try {
        // Construct the data object for the update
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
            // The `connect` and `disconnect` logic works perfectly with `update()`
            ...(batchId ? { batch: { connect: { id: batchId } } } : { batch: { disconnect: true } }),
        };

        // --- THE FIX: Use `update` instead of `updateMany` ---
        // First, verify the link belongs to the user to prevent unauthorized edits.
        const linkToUpdate = await prisma.link.findFirst({
            where: { id, userId }
        });

        if (!linkToUpdate) {
            return res.status(404).json({ error: "Link not found or you don't have permission to edit it." });
        }
        
        // Now, perform the update using the correct `update` method.
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

// @desc    Get all links with search, filtering, and pagination
// @route   GET /api/links
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
// @desc    Get a single link by ID
// @route   GET /api/links/:id
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

// @desc    Update link status (pause/continue)
// @route   PATCH /api/links/:id/status
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


// @desc    Delete a link
// @route   DELETE /api/links/:id
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