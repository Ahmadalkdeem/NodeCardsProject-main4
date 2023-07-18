import { Schema } from "mongoose";
const favoritesSchema = new Schema({
    Email: String,
    arr: []
});
export { favoritesSchema };