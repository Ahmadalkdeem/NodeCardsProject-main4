import { RequestHandler } from "express";
import { dateRegex } from "../validators/utils.js";
import { valfavorite as val } from "../validators/valfavorite.js";
const valfavorite: RequestHandler = async (req: any, res, next) => {
    try {
        const { error } = val.validate({ arr: JSON.parse(req.body.params.arr) });

        if (error) {
            return res.status(400).json({
                message: "Validation Failed",
                errors: error.details.map((ed) => ed.message),
            });
        }

        next()

    } catch {

    }
};
export { valfavorite }