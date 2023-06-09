import { model } from "mongoose";
import { dateSchema } from "../schemas/date.js";
// ~Class in JS
const date = model("date", dateSchema);
// export { date };
