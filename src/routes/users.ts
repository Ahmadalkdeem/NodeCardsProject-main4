import { Router } from "express";
import _ from "underscore";
import jwt from "jsonwebtoken";
import authConfig from '../db/config/auth.config.js';
import { User } from "../db/models/user.js";
import { validateSignUp } from "../middleware/verifySignupBody.js";
import { userAlreadyExists } from "../middleware/userAlreadyExists.js";
import { validateToken } from "../middleware/validtetoken/validtetoken.js";
import bcrypt from "bcryptjs";
import { validateSignIn } from "../middleware/verifySignInBody.js";
import { validateMail } from "../middleware/validateMail.js";
import { ForgotPassword } from "../middleware/ForgotPassword.js";
import { Restartpassword1 } from "../db/models/Restartpassword.js";
import nodemailer from 'nodemailer'
import { validaterestart } from "../middleware/validaterestart.js";

const router = Router();
router.post("/signin", validateSignIn, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "No Such User" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ email: user.email, password: req.body.password }, authConfig.secret, {
      expiresIn: '30d'
    })
    return res.status(200).json(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        accessToken: token
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "server error", error: e })
  }
});

router.post("/valtoken", validateToken, async (req: any, res) => {
  try {

    const user = await User.findOne({ email: req.email });
    const isPasswordValid = await bcrypt.compare(
      req.password,
      user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ email: req.email, password: req.password }, authConfig.secret, {
      expiresIn: '1d'
    })
    return res.json({ accessToken: token, username: user.username, email: user.email, roles: user.roles, id: user._id });

  } catch (e) {
    return res.status(500).json({ message: "Server DB Error", email: `aa  ${req.email}`, password: req.password, error: e });
  }
});

router.post("/signup", validateSignUp, userAlreadyExists, async (req, res) => {
  const body = _.pick(req.body, "username", "email", "password");

  const token = jwt.sign({ email: body.email, password: body.password }, authConfig.secret, {
    expiresIn: '1d'
  })
  body.password = await bcrypt.hash(body.password, 12);
  const user = new User(body);
  try {
    user.roles = ['user'];
    await user.save();
    return res.json({ message: "user saved", id: { accessToken: token, username: user.username, email: user.email, roles: user.roles, id: user._id } });
  } catch (e) {
    return res.status(500).json({ message: "Server DB Error", error: e });
  }
});
//ForgotPassword
router.post('/ForgotPassword', ForgotPassword, async (req, res) => {
  try {
    const body = _.pick(req.body, "email", "password", 'password2');
    const token = jwt.sign({ email: body.email, password: body.password2 }, authConfig.secret, {
      expiresIn: '1d'
    })
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    body.password2 = await bcrypt.hash(body.password2, 12);
    let update = await User.updateOne(
      { email: body.email },
      { $set: { password: body.password2 } }
    );
    if (!update) {
      return res.status(404).json({ message: 'error' });
    }

    return res.status(200).json({ accessToken: token, username: user.username, email: user.email, roles: user.roles, id: user._id });
  } catch (e) {
    return res.status(500).json({ message: "server error", email: req.body.email, error: e })
  }
});
router.post('/Restartpassword', validateMail, async (req, res) => {
  try {
    const body = _.pick(req.body, "email");
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let randomNumber = Math.floor(Math.random() * 100000000);
    let formattedNumber: any = ("000000" + randomNumber).slice(-6);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ahmadalkdeem@gmail.com',
        pass: authConfig.pasword
      }
    });
    const message = {
      from: 'ahmadalkdeem@gmail.com',
      to: body.email,
      subject: 'Subject of the email',
      text: formattedNumber
    };

    await transporter.sendMail(message, function (error, info) {
      if (error) {
        return res.status(400).json({ error: error, ahmad: 'ahmad' })
      } else {
        Restartpassword1.insertMany({ email: body.email, number: formattedNumber, date: new Date() });
        return res.status(200).json({ good: 'good', number: formattedNumber })
      }
    });

  } catch (e) {
    return res.status(500).json({ message: "server error", email: req.body.email, error: e })
  }
});
router.post('/Restartpassword2', validaterestart, async (req, res) => {
  try {
    const body = _.pick(req.body, "email", 'password', 'number');
    const user = await Restartpassword1.findOne({ email: body.email, number: body.number });
    if (!user) {
      return res.status(404).json({ message: 'password not found' });
    }
    await Restartpassword1.deleteMany({ email: body.email });
    body.password = await bcrypt.hash(body.password, 12);
    let update = await User.updateOne(
      { email: body.email },
      { $set: { password: body.password } }
    );
    if (!update) {
      return res.status(404).json({ message: 'error' });
    }
    return res.status(200).json({ good: 'good' });

  } catch (e) {
    return res.status(500).json({ message: "server error", email: req.body.email, error: e })
  }
});


export { router as authRouter };
