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
import { google } from "googleapis";
const oAuth2Client = new google.auth.OAuth2(authConfig.clientId, authConfig.clientSecret, authConfig.regected_url);
oAuth2Client.setCredentials({ refresh_token: authConfig.refrech_token });
//testing
router.get('/ahmad', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let accessToken = yield oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'ahmadalkdeem@gmail.com',
                clientId: authConfig.clientId,
                clientSecret: authConfig.clientSecret,
                refreshToken: authConfig.refrech_token,
                accessToken: accessToken.token
            }
        });
        const message = {
            from: 'ahmad alkdeem ✉ <ahmadalkdeem@gmail.com>',
            to: 'alkdaimahmd@gmail.com',
            subject: 'Subject of the email',
            text: 'Body of the email'
        };
        transporter.sendMail(message, function (error, info) {
            if (error) {
                res.status(400).json({ error: error, ahmad: 'ahmad' });
            }
            else {
                res.status(200).json({
                    good: 'good'
                });
                console.log('Email sent: ');
            }
        });
    }
    catch (e) {
        res.status(400).json({
            error: e,
        });
    }
}));
export { router as emailRouter };
