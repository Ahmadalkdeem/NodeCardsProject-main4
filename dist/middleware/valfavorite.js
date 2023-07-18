var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { valfavorite as val } from "../validators/valfavorite.js";
const valfavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = val.validate({ arr: JSON.parse(req.body.params.arr) });
        if (error) {
            return res.status(400).json({
                message: "Validation Failed",
                errors: error.details.map((ed) => ed.message),
            });
        }
        next();
    }
    catch (_a) {
    }
});
export { valfavorite };
