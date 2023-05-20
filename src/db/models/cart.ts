import { model } from "mongoose";
import { cartsSchema } from "../schemas/cart.js";

// ~Class in JS
const Cart = model("Carts", cartsSchema);

export { Cart };


