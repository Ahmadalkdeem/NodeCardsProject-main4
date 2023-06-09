import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import authConfig from "../../db/config/auth.config.js";
import { users } from "../../db/models/user.js";
import _ from "underscore";
const validateToken3: RequestHandler = async (req: any, res, next) => {
    try {
        const body = _.pick(req.body, "token");
        if (!body.token) {
            return res.status(403).json({ message: "No Token Provided" });
        }

        jwt.verify(body.token, authConfig.secret, async (err, payload: { email: string, randomnumber: string }) => {
            if (err) {
                return res.status(403).json({ message: "Invalid Token" });
            }
            const user: any = await users.findOne({ email: payload.email });
            if (!user) {
                return res.status(401).json({ message: "No Such User" });
            }
            req.email = payload.email
            next()
        });
    } catch {

        return res.status(401).json({ message: 'ops' });
    }
};
export { validateToken3 }