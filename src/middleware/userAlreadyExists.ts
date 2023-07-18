import { RequestHandler } from "express";
import { users } from "../db/models/user.js";
const userAlreadyExists: RequestHandler = async (req, res, next) => {
  try {
    let found = await users.findOne({ email: req.body.email });
    if (found) {
      return res.status(400).json({ message: "Email already exists" });
    }

    next();
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

export {
  userAlreadyExists
}