import { Schema } from "mongoose";
const RestartpasswordSchema = new Schema({
    email: String,
    number: Number
});
export { RestartpasswordSchema };
