import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import authConfig from "../../db/config/auth.config.js";
import { users } from "../../db/models/user.js";

const validateToken4: RequestHandler = async (req: any, res, next) => {
    try {
        const token = req.params.accessToken;
        if (!token) {
            return res.status(403).json({ message: "No Token Provided", token: req.params.accessToken });
        }

        jwt.verify(token, authConfig.secret, async (err, payload: { email: string, password: string }) => {
            if (err) {
                return res.status(403).json({ message: "Invalid Token" });
            }
            const user: any = await users.findOne({ email: payload.email });
            if (!user) {
                return res.status(401).json({ message: "No Such User" });
            }
            if (user.roles[0] === 'admin') {
                next()
            }
        });
    } catch {

    }
};
export { validateToken4 }