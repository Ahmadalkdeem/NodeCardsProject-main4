import { model } from "mongoose";
import { userSchema } from "../schemas/user.js";
const users = model("users", userSchema);
export { users };
