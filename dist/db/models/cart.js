import { model } from "mongoose";
import { cartsSchema } from "../schemas/cart.js";
// ~Class in JS
const Carts = model("Carts", cartsSchema);
export { Carts };
