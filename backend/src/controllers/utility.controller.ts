import { Request, Response } from 'express';
import * as QRCode from 'qrcode';

// --- THIS IS THE FIX ---
// Import the specific type from the library
import { QRCodeErrorCorrectionLevel } from 'qrcode';

export const getQrCode = async (req: Request, res: Response) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL query parameter is required.' });
    }
    try {
        const options = {
            // And cast our string to that type
            errorCorrectionLevel: 'H' as QRCodeErrorCorrectionLevel,
            margin: 2,
            width: 300,
            color: {
                dark: "#0f172a",
                light: "#00000000"
            }
        };

        const qrCodeDataUrl = await QRCode.toDataURL(url, options);
        res.status(200).json({ qrCodeUrl: qrCodeDataUrl });
    } catch (error) {
        console.error('Failed to generate QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code.' });
    }
};

export const streamQrCode = async (req: Request, res: Response) => {
    const { shortCode } = req.params;
    
    // Reconstruct the full URL that the QR code should point to
    const fullUrl = `${process.env.BACKEND_URL}/${shortCode}`;

    try {
        const options = {
            errorCorrectionLevel: 'H' as QRCodeErrorCorrectionLevel,
            margin: 2,
            width: 300,
        };

        // Set the response header to indicate it's a PNG image
        res.setHeader('Content-Type', 'image/png');

        // Generate the QR code and stream it directly to the response
        QRCode.toFileStream(res, fullUrl, options);

    } catch (error) {
        console.error('Failed to generate QR code stream:', error);
        res.status(500).json({ error: 'Failed to generate QR code.' });
    }
};