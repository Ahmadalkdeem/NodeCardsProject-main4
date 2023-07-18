import { schemaMail } from "../validators/validateMail.js";
const validateMail = (req, res, next) => {
    var _a;
    const { error } = schemaMail.validate({ email: (_a = req.query.email) !== null && _a !== void 0 ? _a : req.body.email });
    if (error) {
        return res.status(400).json({
            message: "Validation Failed",
            errors: error.details.map((ed) => ed.message),
        });
    }
    next();
};
export { validateMail };
