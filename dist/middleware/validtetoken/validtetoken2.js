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
const validateToken2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.query.accessToken) !== null && _a !== void 0 ? _a : req.body.params.accessToken;
        if (!token) {
            return res.status(403).json({ message: "No Token Provided", token: req.body });
        }
        jwt.verify(token, authConfig.secret, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).json({ message: "Invalid Token" });
            }
            const user = yield users.findOne({ email: payload.email });
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
                next();
            }
        }));
    }
    catch (_b) {
    }
});
export { validateToken2 };
