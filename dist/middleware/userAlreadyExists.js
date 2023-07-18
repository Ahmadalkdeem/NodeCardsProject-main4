var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { users } from "../db/models/user.js";
const userAlreadyExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let found = yield users.findOne({ email: req.body.email });
        if (found) {
            return res.status(400).json({ message: "Email already exists" });
        }
        next();
    }
    catch (e) {
        res.status(500).json({ message: e });
    }
});
export { userAlreadyExists };
