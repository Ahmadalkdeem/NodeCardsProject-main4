import joi from "joi";

const schema = joi.object({
    skip: joi.number().min(0).required(),
});
const schema2 = joi.object({
    sort: joi.number().min(-1).max(1).required(),
    limet: joi.number().min(0).max(100).required(),
});

export { schema as numbersSchema, schema2 as numbersSchema2 };