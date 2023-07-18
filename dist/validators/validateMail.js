import joi from "joi";
import { valMail } from "./utils.js";
const schema = joi.object({
    email: joi.string().min(2).max(100).regex(valMail).required()
});
export { schema as schemaMail };
