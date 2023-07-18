import _ from "underscore";
import { RestartpasswordSchema } from "../validators/validaterestart.js";
const validaterestart = (req, res, next) => {
    const body = _.pick(req.body, "email", 'number', 'password');
    const { error } = RestartpasswordSchema.validate(body);
    if (error) {
        return res.status(400).json({
            message: "Validation Failed",
            body: body,
            errors: error.details.map((ed) => ed.message),
        });
    }
    next();
};
// export { validaterestart };
