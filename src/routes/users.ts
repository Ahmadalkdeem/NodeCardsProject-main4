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
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateMail } from "../middleware/validateMail.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { ForgotPassword } from "../middleware/ForgotPassword.js";
import { validatenumber } from "../middleware/number/number.js";
import { numbersSchema } from "../validators/number.js";
import { Restartpassword } from "../db/models/Restartpassword.js";

import nodemailer from 'nodemailer'

const router = Router();
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ahmadalkdeem@gmail.com',
        pass: authConfig.pasword
      }
    });
    let randomNumber = Math.floor(Math.random() * 100000000);
    let formattedNumber = ("000000" + randomNumber).slice(-6);
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
        return res.status(200).json({ good: 'good', number: formattedNumber })
      }
    });

  } catch (e) {
    return res.status(500).json({ message: "server error", email: req.body.email, error: e })
  }
});


//validateSignIn
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

router.get('/users/:accessToken/:skip', validateToken2, validatenumber, async (req, res) => {
  try {
    let numberskip = Number(req.params.skip)
    const user = await User.find({}, { username: 1, email: 1, roles: 1 }).limit(50).skip(numberskip);
    if (!user) {
      return res.status(401).json({ message: "No Such User" });
    }
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ message: "server error", error: e })
  }
});
router.delete('/users/:id/:accessToken', validateToken2, validateObjectid, async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.params.id });
    if (!user) {
      return res.status(401).json({ message: "No Such User" });
    }


    return res.status(200).json({ Message: 'susces', id: req.params.id });
  } catch (e) {
    return res.status(500).json({ message: "server error", error: e })
  }
});
router.put('/users/admin/:id/:accessToken', validateToken2, validateObjectid, async (req, res) => {
  try {
    const users = req.params.id;
    const user = await User.updateOne({ _id: users }, { roles: ['admin'] });
    if (!user) {
      return res.status(401).json({ message: "No Such User" });
    }


    return res.status(200).json({ Message: 'susces', user: `${req.params.users} ahmad` });
  } catch (e) {
    return res.status(500).json({ message: "server error", error: e })
  }
});
router.put('/users/user/:id/:accessToken', validateToken2, validateObjectid, async (req, res) => {
  try {
    const users = req.params.id;
    const user = await User.updateOne({ _id: users }, { roles: ['user'] });
    if (!user) {
      return res.status(401).json({ message: "No Such User" });
    }


    return res.status(200).json({ Message: 'susces', user: req.params.users });
  } catch (e) {
    return res.status(500).json({ message: "server error", error: e })
  }
});
router.post('/getuser', validateMail, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }, { username: 1, email: 1, roles: 1 });
    if (!user) {
      return res.status(401).json({ message: "No Such User" });
    }

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ message: "server error", error: e })
  }
});


export { router as authRouter };
