import { Schema } from "mongoose";
const dateSchema = new Schema({
    date: Date,
    pricecart: Number,
});
export { dateSchema };