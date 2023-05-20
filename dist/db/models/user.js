import { model } from "mongoose";
import { userSchema } from "../schemas/user.js";
const User = model("users", userSchema);
export { User };
