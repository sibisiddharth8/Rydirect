import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const templatePath = path.join(__dirname, '../templates/otp.template.html');
  let htmlContent = fs.readFileSync(templatePath, 'utf8');
  htmlContent = htmlContent.replace('{{otp}}', otp);

  const mailOptions = {
    from: `"Rydirect" <${process.env.MAIL_USER}>`,
    to: to,
    subject: 'Your Password Reset OTP',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};