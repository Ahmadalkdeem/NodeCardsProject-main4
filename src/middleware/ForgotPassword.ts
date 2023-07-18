import { RequestHandler } from "express";
import { ForgotPasswordSchema } from "../validators/ForgotPassword.js";
import _ from "underscore";
const ForgotPassword: RequestHandler = async (req: any, res, next) => {
    try {
        const body = _.pick(req.body, "email", 'password', 'password2');
        const { error } = ForgotPasswordSchema.validate(body);

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
export { ForgotPassword }