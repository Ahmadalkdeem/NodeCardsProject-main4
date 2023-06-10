import joi from "joi";
import { setPermissivecategory, categoryselect2, brand, size, color, objectIdRegex, urlRegex } from "./utils.js";

const schema = joi.object({
  titel: joi.string().min(2).max(40).required(),
  brand: joi.string().min(2).max(20).regex(brand).required(),
  setPermissivecategory: joi.string().regex(setPermissivecategory).required(),
  categoryselect2: joi.string().regex(categoryselect2).required(),
  description: joi.string().min(10).max(1500).required(),
  saleprice: joi.number().min(1).max(10000).required(),
  regularprice: joi.number().min(1).max(10000).required(),
  fSizeOptions2: joi.array().items(joi.object({ size: joi.string().regex(size).required(), colors: joi.array().items(joi.object({ color: joi.string().regex(color).required() })).required().min(1).max(25) }).required()).min(1).max(25).required()
});
const schema2 = joi.object({
  titel: joi.string().min(2).max(40).required(),
  brand: joi.string().min(2).max(20).regex(brand).required(),
  setPermissivecategory: joi.string().regex(setPermissivecategory).required(),
  id: joi.string().regex(objectIdRegex).required(),
  fcategory: joi.string().regex(setPermissivecategory).required(),
  categoryselect2: joi.string().regex(categoryselect2).required(),
  description: joi.string().min(10).max(1500).required(),
  saleprice: joi.number().min(1).max(10000).required(),
  regularprice: joi.number().min(1).max(10000).required(),
  fSizeOptions2: joi.array().items(joi.object({ size: joi.string().regex(size).required(), colors: joi.array().items(joi.object({ color: joi.string().regex(color).required() })).required().min(1).max(25) }).required()).min(1).max(25).required(),
  photodelte: joi.array().items(joi.string().regex(urlRegex)).min(0).max(8),
  photos: joi.array().items(joi.string().regex(urlRegex)).min(0).max(8)
});
const schema3 = joi.object({
  id: joi.string().regex(objectIdRegex).required(),
  color: joi.string().regex(color).required(),
  sizeselect: joi.string().regex(size).required(),
  quantity: joi.number().min(1).max(10).required()
});

export { schema as cardSchema, schema2 as cardUpdateSchema, schema3 as orderSchema };