// src/lib/email.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendEmail(
    to: string,
    subject: string,
    text: string
) {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: text
    });
}