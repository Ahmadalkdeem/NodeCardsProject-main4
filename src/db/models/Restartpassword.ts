import { model } from "mongoose";
import { RestartpasswordSchema } from "../schemas/Restartpassword.js";

// ~Class in JS
const Restartpassword1 = model("Restartpassword", RestartpasswordSchema);

export { Restartpassword1 };