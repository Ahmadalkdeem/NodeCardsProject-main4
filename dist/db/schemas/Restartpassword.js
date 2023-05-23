import { Schema } from "mongoose";
const RestartpasswordSchema = new Schema({
    email: String,
    number: String,
    date: Date
});
export { RestartpasswordSchema };
