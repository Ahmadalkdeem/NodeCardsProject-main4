import { RequestHandler } from "express";
import { PasswordSchema } from "../validators/Password.js";
import _ from "underscore";
const valpassword: RequestHandler = async (req: any, res, next) => {
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

        next()
    } catch (e) {
        return res.status(400).json({ e: e });
    }
};
export { valpassword }