import joi from "joi";
import { addressRegex, cityRegex, fullNameRegex, isZipRegex, valMail } from "./utils.js";
import { orderSchema } from './cards.js';
const schema = joi.object({
    fullname: joi.string().min(2).max(40).regex(fullNameRegex).required(),
    Email: joi.string().min(2).max(40).regex(valMail).required(),
    Address: joi.string().min(2).max(20).regex(addressRegex).required(),
    Address2: joi.string().min(2).max(20).regex(addressRegex),
    City: joi.string().min(2).max(20).regex(cityRegex).required(),
    Zip: joi.string().min(2).max(20).regex(isZipRegex).required(),
    arr: joi.array().items(orderSchema).min(1).max(100)
});
export { schema as orderSchema };
