import { RequestHandler } from "express";
import { dateRegex } from "../validators/utils.js";
const validatedate: RequestHandler = async (req: any, res, next) => {
    try {
        const str = dateRegex.test(req.query.str);
        const end = dateRegex.test(req.query.end);
        if (!str) {
            return res.status(403).json({ message: "No date Provided" });
        }
        if (!end) {
            return res.status(403).json({ message: "No id Provided" });
        }

        next()
    } catch {

    }
};
export { validatedate }