import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs-extra';

import prisma from '../lib/prisma';

const RESERVED_WORDS = [
    'api', 'dashboard', 'links', 'analytics', 'settings', 'profile', 
    'all', 'redirect', 'login', 'logout', 'forgot-password', 'reset-password'
];

const deleteFile = (fileUrl: string | null | undefined) => {
    if (!fileUrl) return;
    try {
        const filename = path.basename(new URL(fileUrl).pathname);
        const filePath = path.join('uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.removeSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file ${fileUrl}:`, error);
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

// @desc    Create a new link
// @route   POST /api/links
export const createLink = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    
    const { 
        name, shortCode, redirectTo, batchId, visibility, isPaused,
        useSplashPage, splashPageDesign, activeFrom, activeUntil, 
        splashPageDuration, password, companyName, 
        companyLogoUrl, heroImageUrl, ctaText, iconUrl
    } = req.body;

    if (shortCode.includes('/')) {
        return res.status(400).json({ error: 'Short codes cannot contain slashes (/).' });
    }

    if (RESERVED_WORDS.includes(shortCode.toLowerCase())) {
        return res.status(400).json({ error: `"${shortCode}" is a reserved word and cannot be used.` });
    }

    if (!isPaused) {
        const duplicate = await checkActiveDuplicate(shortCode, userId);
        if (duplicate) {
            return res.status(409).json({ error: 'Another link with this short code is already active.' });
        }
    }

    try {
        const dataToSave: Prisma.LinkCreateInput = {
            user: { connect: { id: userId } },
            name, shortCode, redirectTo, visibility,
            isPaused: Boolean(isPaused),
            useSplashPage: Boolean(useSplashPage),
            splashPageDesign,
            splashPageDuration: Number(splashPageDuration),
            activeFrom: activeFrom ? new Date(activeFrom) : null,
            activeUntil: activeUntil ? new Date(activeUntil) : null,
            companyName, companyLogoUrl, heroImageUrl, ctaText, iconUrl,
            ...(batchId && { batch: { connect: { id: batchId } } }),
        };

        if (password) {
            dataToSave.password = await bcrypt.hash(password, 10);
        }

        const link = await prisma.link.create({ data: dataToSave });
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
    const newData = req.body;

    if (newData.shortCode.includes('/')) {
        return res.status(400).json({ error: 'Short codes cannot contain slashes (/).' });
    }

    if (RESERVED_WORDS.includes(newData.shortCode.toLowerCase())) {
        return res.status(400).json({ error: `"${newData.shortCode}" is a reserved word and cannot be used.` });
    }

    if (!newData.isPaused) {
        const duplicate = await checkActiveDuplicate(newData.shortCode, userId, id);
        if (duplicate) {
            return res.status(409).json({ error: 'Another link with this short code is already active.' });
        }
    }
    
    try {
        const existingLink = await prisma.link.findFirst({
            where: { id, userId }
        });

        if (!existingLink) {
            return res.status(404).json({ error: "Link not found or you don't have permission to edit it." });
        }
        
        // Cleanup old images if new ones are provided
        if (newData.iconUrl !== existingLink.iconUrl) {
            deleteFile(existingLink.iconUrl);
        }
        if (newData.companyLogoUrl !== existingLink.companyLogoUrl) {
            deleteFile(existingLink.companyLogoUrl);
        }
        if (newData.heroImageUrl !== existingLink.heroImageUrl) {
            deleteFile(existingLink.heroImageUrl);
        }

        const dataToUpdate: Prisma.LinkUpdateInput = {
            name: newData.name, shortCode: newData.shortCode, redirectTo: newData.redirectTo,
            visibility: newData.visibility, isPaused: Boolean(newData.isPaused),
            useSplashPage: Boolean(newData.useSplashPage), splashPageDesign: newData.splashPageDesign,
            splashPageDuration: Number(newData.splashPageDuration),
            activeFrom: newData.activeFrom ? new Date(newData.activeFrom) : null,
            activeUntil: newData.activeUntil ? new Date(newData.activeUntil) : null,
            companyName: newData.companyName,
            companyLogoUrl: newData.companyLogoUrl, heroImageUrl: newData.heroImageUrl,
            ctaText: newData.ctaText, iconUrl: newData.iconUrl,
            ...(newData.batchId ? { batch: { connect: { id: newData.batchId } } } : { batch: { disconnect: true } }),
        };
        
        if (newData.password) {
            dataToUpdate.password = await bcrypt.hash(newData.password, 10);
        } else if (newData.password === '') {
            dataToUpdate.password = null;
        }

        await prisma.link.update({ where: { id: id }, data: dataToUpdate });
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
        const linkToDelete = await prisma.link.findFirst({
            where: { id, userId },
        });

        if (!linkToDelete) {
            return res.status(404).json({ error: 'Link not found or you do not have permission to delete.' });
        }

        // Delete all associated image files first
        deleteFile(linkToDelete.iconUrl);
        deleteFile(linkToDelete.companyLogoUrl);
        deleteFile(linkToDelete.heroImageUrl);

        // Then delete the link from the database
        await prisma.link.delete({
            where: { id: id },
        });
        
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
    
    try {
        if (action === 'delete') {
            const linksToDelete = await prisma.link.findMany({
                where: { id: { in: linkIds }, userId }
            });

            for (const link of linksToDelete) {
                deleteFile(link.iconUrl);
                deleteFile(link.companyLogoUrl);
                deleteFile(link.heroImageUrl);
            }
        }

        let result;
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