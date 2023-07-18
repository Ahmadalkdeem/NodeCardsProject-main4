var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { numbersSchema } from "../../validators/number.js";
const skip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = numbersSchema.validate({ skip: req.query.skip });
        if (error) {
            return res.status(400).json({
                message: "Validation number",
            });
        }
        next();
    }
    catch (_a) {
    }
});
export { skip };
