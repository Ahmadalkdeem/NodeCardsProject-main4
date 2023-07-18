import joi from "joi";
import { brand, color, size, categoryselect2, setPermissivecategory } from "./utils.js";
const schema = joi.object({
    brands: joi.array().items(joi.string().regex(brand).required()),
    sizes: joi.array().items(joi.string().regex(size).required()).min(1).max(50),
    categorys: joi.array().items(joi.string().regex(setPermissivecategory).required()).min(1).max(50),
    categorys2: joi.array().items(joi.string().regex(categoryselect2).required()).min(1).max(50),
    colors: joi.array().items(joi.string().regex(color).required()).min(1).max(50)
});
export { schema as validatefindSchema };
