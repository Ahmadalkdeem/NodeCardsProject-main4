import joi from "joi";
import { passwordRegex, valMail } from "./utils.js";
const schema = joi.object({
    email: joi.string().regex(valMail).min(0).max(100).required(),
    password: joi.string().regex(passwordRegex).required(),
    password2: joi.string().regex(passwordRegex).required(),
});


export { schema as ForgotPasswordSchema };