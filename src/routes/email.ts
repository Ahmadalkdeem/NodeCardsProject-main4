import { Router } from "express";
const router = Router();
import nodemailer from 'nodemailer'
import authConfig from "../db/config/auth.config.js";


router.get('/ahmad', async (req: any, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ahmadalkdeem@gmail.com',
                pass: authConfig.pasword
            }
        });

        const message = {
            from: 'ahmadalkdeem@gmail.com',
            to: 'alkdaimahmd@gmail.com',
            subject: 'Subject of the email',
            text: 'Body of the email'
        };

        transporter.sendMail(message, function (error, info) {
            if (error) {
                res.status(400).json({ error: error, ahmad: 'ahmad' })
            } else {
                res.status(200).json({ good: 'good' })
                console.log('Email sent: ');
            }
        });

    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})



export { router as emailRouter };
