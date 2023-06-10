import { model } from "mongoose";
import { cartsSchema } from "../schemas/cart.js";

const Carts = model("Carts", cartsSchema);

export { Carts };


