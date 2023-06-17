import { RequestHandler } from "express";
import { numbersSchema2 } from "../../validators/number.js";
const validatenumber2: RequestHandler = async (req: any, res, next) => {
    try {
        const { error } = numbersSchema2.validate({ sort: req.query.sort, limet: req.query.limet });
        if (error) {
            return res.status(400).json({
                message: "Validation number",
            });
        }
        next()
    } catch {

    }
};
export { validatenumber2 }