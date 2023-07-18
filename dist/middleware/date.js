var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { dateRegex } from "../validators/utils.js";
const validatedate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const str = dateRegex.test(req.query.str);
        const end = dateRegex.test(req.query.end);
        if (!str) {
            return res.status(403).json({ message: "No date Provided" });
        }
        if (!end) {
            return res.status(403).json({ message: "No id Provided" });
        }
        next();
    }
    catch (_a) {
    }
});
export { validatedate };
