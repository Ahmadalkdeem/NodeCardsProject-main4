import { RequestHandler } from "express";
import _ from "underscore";
import { validatefindSchema } from "../../validators/validateFind.js";
const validatefind: RequestHandler = async (req: any, res, next) => {
    try {
        const body = _.pick(req.query, "sizes", 'colors', 'brands', 'categorys2', 'categorys');
        const { error } = validatefindSchema.validate(body);

        if (error) {
            return res.status(400).json({
                message: "Validation Failed",
                body: body,
                errors: error.details.map((ed) => ed.message),
            });
        }
        next();
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export {
    validatefind
}