import jwt from "jsonwebtoken";
import authConfig from "../../db/config/auth.config.js";
const validateToken = (req, res, next) => {
    const token = req.body.params.accessToken;
    if (!token) {
        return res.status(403).json({ message: "No Token Provided", token: req.body });
    }
    jwt.verify(token, authConfig.secret, (err, payload) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }
        req.email = payload.email;
        req.password = payload.password;
        next();
    });
};
export { validateToken };
