import joi from "joi";
import { passwordRegex, valMail } from "./utils.js";
const schema = joi.object({
    number: joi.string().required(),
    password: joi.string().regex(passwordRegex).required(),
    email: joi.string().regex(valMail).required(),
});
export { schema as RestartpasswordSchema };
