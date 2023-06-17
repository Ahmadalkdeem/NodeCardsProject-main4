import { Router } from "express";
import _ from "underscore";
import jwt from "jsonwebtoken";
import authConfig from '../db/config/auth.config.js';
import { users } from "../db/models/user.js";
import { validateSignUp } from "../middleware/verifySignupBody.js";
import { userAlreadyExists } from "../middleware/userAlreadyExists.js";
import { validateToken } from "../middleware/validtetoken/validtetoken.js";
import bcrypt from "bcryptjs";
import { validateSignIn } from "../middleware/verifySignInBody.js";
import { validateMail } from "../middleware/validateMail.js";
import { ForgotPassword } from "../middleware/ForgotPassword.js";
import nodemailer from 'nodemailer'
import { valpassword } from "../middleware/valpassword.js";
import { google } from "googleapis";
import { validateToken3 } from "../middleware/validtetoken/validateToken3.js";
import { favorites } from "../db/models/favorites.js";
let oAuth2Client = new google.auth.OAuth2(authConfig.clientId, authConfig.clientSecret, authConfig.regected_url)
oAuth2Client.setCredentials({ refresh_token: authConfig.refrech_token })

export let aggregte = [
  { $unwind: '$arr' },
  {
    $lookup: {
      from: 'shoesproducts',
      localField: 'arr',
      foreignField: '_id',
      as: 'shoesproducts'
    }
  },
  {
    $lookup: {
      from: 'shirtsproducts',
      localField: 'arr',
      foreignField: '_id',
      as: 'shirtsproducts'
    }
  },
  {
    $lookup: {
      from: 'pantsproducts',
      localField: 'arr',
      foreignField: '_id',
      as: 'pantsproducts'
    }
  },
  {
    $group: {
      _id: '$Email',
      products: {
        $push: {
          $concatArrays: ['$shoesproducts', '$shirtsproducts', '$pantsproducts']
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      Email: '$_id',
      products: {
        $reduce: {
          input: '$products',
          initialValue: [],
          in: { $setUnion: ['$$value', '$$this'] }
        }
      }
    }
  }
]

const router = Router();
router.post("/signin", validateSignIn, async (req, res) => {
  try {
    const user = await users.findOne({ email: req.body.email });
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
      expiresIn: '1d'
    })
    const favorite = await favorites.aggregate([
      { $match: { Email: req.body.email } }
      , ...aggregte]);
    return res.status(200).json(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        accessToken: token,
        favorite: favorite
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "server error", error: e })
  }
});

router.post("/valtoken", validateToken, async (req: any, res) => {
  try {
    const user = await users.findOne({ email: req.email });
    const isPasswordValid = await bcrypt.compare(
      req.password,
      user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const favorite = await favorites.aggregate([
      { $match: { Email: req.email } }
      , ...aggregte]);
    const token = jwt.sign({ email: req.email, password: req.password }, authConfig.secret, {
      expiresIn: '1d'
    })
    return res.json({ accessToken: token, username: user.username, email: user.email, roles: user.roles, id: user._id, favorite: favorite });

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
  const user = new users(body);
  const favorite = new favorites({ Email: body.email, arr: [] });
  try {
    user.roles = ['user'];
    await user.save();
    await favorite.save();
    return res.json({ message: "user saved", id: { accessToken: token, username: user.username, email: user.email, roles: user.roles, id: user._id } });
  } catch (e) {
    return res.status(500).json({ message: "Server DB Error", error: e });
  }
});
router.post('/ForgotPassword', ForgotPassword, async (req, res) => {
  try {
    const body = _.pick(req.body, "email", "password", 'password2');
    const user = await users.findOne({ email: body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = jwt.sign({ email: body.email, password: body.password2 }, authConfig.secret, {
      expiresIn: '1d'
    })
    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    body.password2 = await bcrypt.hash(body.password2, 12);
    let update = await users.updateOne(
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
    const user = await users.findOne({ email: body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let randomNumber = Math.floor(Math.random() * 100000000);
    let formattedNumber: any = ("000000" + randomNumber).slice(-6);
    const token = jwt.sign({ email: user.email, randomnumber: req.body.password }, authConfig.secret, {
      expiresIn: '1h'
    })

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
      text: `http://localhost:3000/pasword/token/${token}`
    };

    await transporter.sendMail(message, function (error, info) {
      if (error) {
        res.status(400).json({ error: error, ahmad: 'ahmad' })
      } else {
        res.status(200).json({ good: 'good' })
        console.log('Email sent: ');
      }
    });
    return res.status(200).json({ good: 'good', number: formattedNumber })


    // let accessToken = await oAuth2Client.getAccessToken()
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     type: 'OAuth2',
    //     user: 'ahmadalkdeem@gmail.com',
    //     clientId: authConfig.clientId,
    //     clientSecret: authConfig.clientSecret,
    //     refreshToken: authConfig.refrech_token,
    //     accessToken: accessToken.token
    //   }
    // });

    // const message = {
    //   from: 'ahmadalkdeem@gmail.com',
    //   to: req.body.email,
    //   subject: 'Subject of the email',
    //   text: `http://localhost:3000/pasword/token/${token}`
    // };

    // await transporter.sendMail(message, function (error, info) {
    //   if (error) {
    //     return res.status(400).json({ error: error, ahmad: 'ahmad' })
    //   } else {
    //     return res.status(200).json({ good: 'good', number: formattedNumber })
    //   }
    // });

  } catch (e) {
    return res.status(500).json({ message: "server error", email: req.body.email, error: e })
  }
});
router.post('/Restartpassword2', validateToken3, valpassword, async (req: any, res) => {
  try {
    const body = _.pick(req.body, "token", 'password');
    body.password = await bcrypt.hash(body.password, 12);
    let update = await users.updateOne(
      { email: req.email },
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
