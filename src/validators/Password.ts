import joi from "joi";
import { passwordRegex } from "./utils.js";
const schema = joi.object({
    password: joi.string().regex(passwordRegex).required(),
});


export { schema as PasswordSchema };