import { RequestHandler } from "express";
import { numbersSchema } from "../../validators/number.js";
const skip: RequestHandler = async (req: any, res, next) => {
    try {
        const { error } = numbersSchema.validate({ skip: req.query.skip });
        if (error) {
            return res.status(400).json({
                message: "Validation number",
            });
        }
        next()
    } catch {

    }
};
export { skip }