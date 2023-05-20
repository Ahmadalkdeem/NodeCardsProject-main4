import { RequestHandler } from "express";
import _ from "underscore";
import { schemaMail } from "../validators/validateMail.js";
const validateMail: RequestHandler = (req, res, next) => {
    const body = _.pick(req.body, "email");

    const { error } = schemaMail.validate(body);

    if (error) {
        return res.status(400).json({
            message: "Validation Failed",
            body: body,
            errors: error.details.map((ed) => ed.message),
        });
    }

    next();
};

export { validateMail };
