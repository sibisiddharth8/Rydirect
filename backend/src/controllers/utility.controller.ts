import { Request, Response } from 'express';
import * as QRCode from 'qrcode';

// @desc    Generate a QR code for a link
// @route   GET /api/utility/qrcode
export const getQrCode = async (req: Request, res: Response) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).send('URL query parameter is required.');
    }
    try {
        const qrCodeImage = await QRCode.toDataURL(url);
        res.status(200).send(`<img src="${qrCodeImage}">`);
    } catch (error) {
        res.status(500).send('Failed to generate QR code.');
    }
};