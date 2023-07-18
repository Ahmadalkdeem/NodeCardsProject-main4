import { Schema } from "mongoose";
const cartsSchema = new Schema({
    fullname: String,
    Email: String,
    Address: String,
    Address2: String,
    City: String,
    Zip: String,
    cart: String,
    date: Date,
    pricecart: Number,
    status: Boolean,
    arr: []
});
export { cartsSchema };
