import mongoose from "mongoose";

const connect = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(``);
};

export { connect };
