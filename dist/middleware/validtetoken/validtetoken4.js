var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import authConfig from "../../db/config/auth.config.js";
import { users } from "../../db/models/user.js";
const validateToken4 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.accessToken;
        if (!token) {
            return res.status(403).json({ message: "No Token Provided", token: req.params.accessToken });
        }
        jwt.verify(token, authConfig.secret, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).json({ message: "Invalid Token" });
            }
            const user = yield users.findOne({ email: payload.email });
            if (!user) {
                return res.status(401).json({ message: "No Such User" });
            }
            if (user.roles[0] === 'admin') {
                next();
            }
        }));
    }
    catch (_a) {
    }
});
export { validateToken4 };
