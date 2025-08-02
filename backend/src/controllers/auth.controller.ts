import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../services/mail.service';
import { generateOtp } from '../utils/generateOtp';

import prisma from '../lib/prisma';

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    console.log('Request body received on server:', req.body);
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOtp();
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10); // OTP valid for 10 minutes

        await prisma.user.update({
            where: { email },
            data: { passwordResetOtp: otp, passwordResetExpiry: expiry },
        });

        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Failed to send OTP email:', error); 
        res.status(500).json({ error: 'Error sending OTP' });
    }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password-otp
export const resetPasswordWithOtp = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.passwordResetOtp !== otp || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                passwordResetOtp: null,
                passwordResetExpiry: null,
            },
        });

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Reset password using old password (for logged-in users)
// @route   POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
    // Assuming user ID is available from a JWT middleware
    const userId = (req as any).user.id; 
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !await bcrypt.compare(oldPassword, user.password)) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};