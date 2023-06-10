import { model } from "mongoose";
import { favoritesSchema } from "../schemas/favorites.js";
const favorites = model("favorites", favoritesSchema);
export { favorites };
