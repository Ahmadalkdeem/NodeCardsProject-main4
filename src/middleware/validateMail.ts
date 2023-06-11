import { RequestHandler } from "express";
import { schemaMail } from "../validators/validateMail.js";
const validateMail: RequestHandler = (req, res, next) => {

    const { error } = schemaMail.validate({ email: req.query.email ?? req.body.email });

    if (error) {
        return res.status(400).json({
            message: "Validation Failed",
            errors: error.details.map((ed) => ed.message),
        });
    }

    next();
};

export { validateMail };
