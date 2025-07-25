import { Request, Response } from 'express';
import * as QRCode from 'qrcode';

// @desc    Generate a QR code and return it as a data URL
// @route   GET /api/utility/qrcode
export const getQrCode = async (req: Request, res: Response) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL query parameter is required.' });
    }
    try {
        // Generate the QR code as a Base64 Data URL
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 256,
        });
        // Send the data URL back as JSON
        res.status(200).json({ qrCodeUrl: qrCodeDataUrl });
    } catch (error) {
        console.error('Failed to generate QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code.' });
    }
};