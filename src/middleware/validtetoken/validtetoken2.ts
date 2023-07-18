import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import authConfig from "../../db/config/auth.config.js";
import { users } from "../../db/models/user.js";

const validateToken2: RequestHandler = async (req: any, res, next) => {
    try {
        const token = req.query.accessToken ?? req.body.params.accessToken;
        if (!token) {
            return res.status(403).json({ message: "No Token Provided", token: req.body });
        }

        jwt.verify(token, authConfig.secret, async (err, payload: { email: string, password: string }) => {
            if (err) {
                return res.status(403).json({ message: "Invalid Token" });
            }
            const user: any = await users.findOne({ email: payload.email });
            if (!user) {
                return res.status(401).json({ message: "No Such User" });
            }
            // const isPasswordValid = await bcrypt.compare(
            //     payload.password,
            //     user.password
            // );

            // if (!isPasswordValid) {
            //     return res.status(401).json({ message: "Invalid Credentials" });
            // }
            if (user.roles[0] === 'admin') {
                next()
            }
        });
    } catch {

    }
};
export { validateToken2 }