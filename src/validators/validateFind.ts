import joi from "joi";
import { brand, color, size } from "./utils.js";

const schema = joi.object({
    brands: joi.array().items(joi.string().regex(brand).required()).min(1).max(50),
    sizes: joi.array().items(joi.string().regex(size).required()).min(1).max(50),
    colors: joi.array().items(joi.string().regex(color).required()).min(1).max(50)
});


export { schema as validatefindSchema };