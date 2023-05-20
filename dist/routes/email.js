var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
const router = Router();
import nodemailer from 'nodemailer';
import authConfig from "../db/config/auth.config.js";
router.get('/ahmad', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                res.status(400).json({ error: error, ahmad: 'ahmad' });
            }
            else {
                res.status(200).json({ good: 'good' });
                console.log('Email sent: ');
            }
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
export { router as emailRouter };
