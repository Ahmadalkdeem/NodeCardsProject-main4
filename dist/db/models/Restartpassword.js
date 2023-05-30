import { model } from "mongoose";
import { RestartpasswordSchema } from "../schemas/Restartpassword.js";
// ~Class in JS
const Restartpassword = model("Restartpassword", RestartpasswordSchema);
export { Restartpassword };
