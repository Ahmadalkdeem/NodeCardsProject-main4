import { Schema } from "mongoose";

const productSchema = new Schema({
    id: String,
    src: [],
    description: String,
    name: String,
    brand: String,
    category: String,
    category2: String,
    price: Number,
    price2: Number,
    stock: []
});

export { productSchema };
