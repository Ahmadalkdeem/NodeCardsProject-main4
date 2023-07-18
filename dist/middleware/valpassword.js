var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PasswordSchema } from "../validators/Password.js";
import _ from "underscore";
const valpassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = _.pick(req.body, "password");
        const { error } = PasswordSchema.validate(body);
        if (error) {
            return res.status(400).json({
                message: "Validation Failed",
                body: body,
                errors: error.details.map((ed) => ed.message),
            });
        }
        next();
    }
    catch (e) {
        return res.status(400).json({ e: e });
    }
});
export { valpassword };
