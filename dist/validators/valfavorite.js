import Joi from "joi";
import { objectIdRegex } from "./utils.js";
const valfavorite = Joi.object({
    arr: Joi.array().items(Joi.string().regex(objectIdRegex).required()).required(),
});
export { valfavorite };
