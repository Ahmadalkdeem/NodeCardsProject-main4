import { RequestHandler } from "express";
import { numbersSchema } from "../../validators/number.js";
const validatenumber: RequestHandler = async (req: any, res, next) => {
    try {
        const { error } = numbersSchema.validate({ str: Number(req.params.skip) });
        if (error) {
            return res.status(400).json({
                message: "Validation number",
            });
        }
        next()
    } catch {

    }
};
export { validatenumber }