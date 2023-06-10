import { model } from "mongoose";
import { productSchema } from "../schemas/product.js";

const pantsproduct = model("pantsproduct", productSchema);
const Shirtsproduct = model("Shirtsproduct", productSchema);
const shoesproduct = model("shoesproduct", productSchema);

export { pantsproduct, Shirtsproduct, shoesproduct };