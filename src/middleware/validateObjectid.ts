import { RequestHandler } from "express";
import { objectIdRegex } from "../validators/utils.js";
const validateObjectid: RequestHandler = async (req: any, res, next) => {
    try {

        const id = objectIdRegex.test(req.params.id);
        if (!id) {
            return res.status(403).json({ message: "No id Provided" });
        }

        next()
    } catch {

    }
};
export { validateObjectid }