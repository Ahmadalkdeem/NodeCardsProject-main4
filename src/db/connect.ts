import mongoose from "mongoose";
import authConfig from "./config/auth.config.js";

const connect = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(authConfig.connect);
};



export { connect };
