import { Router } from "express";
const router = Router();
import _ from "underscore";
import { Cart } from "../db/models/cart.js";
import { date } from '../db/models/date.js'
import { validateToken2 } from "../middleware/validtetoken2.js";
import { validateorder } from "../middleware/order.js";
import { neworder } from "../middleware/neworder.js";
import nodemailer from 'nodemailer'
import { validatenumber } from "../middleware/number.js";
import authConfig from "../db/config/auth.config.js";

router.post('/neworder', validateorder, neworder, async (req: any, res) => {
    try {
        let detales = {
            date: new Date(),
            pricecart: req.body.pricecart
        }
        let arr = {
            fullname: req.body.fullname,
            Email: req.body.Email,
            Address: req.body.Address,
            Address2: req.body.Address2,
            City: req.body.City,
            Zip: req.body.Zip,
            arr: req.arr,
            ...detales
        }

        let cart = await new Cart(arr).save()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ahmadalkdeem@gmail.com',
                pass: authConfig.pasword
            }
        });

        const message = {
            from: 'ahmadalkdeem@gmail.com',
            to: req.body.Email,
            subject: 'Subject of the email',
            text: `${cart._id}`
        };

        await transporter.sendMail(message, function (error, info) {
            if (error) {
                res.status(400).json({ error: error, ahmad: 'ahmad' })
            } else {
                res.status(200).json({ good: 'good' })
                console.log('Email sent: ');
            }
        });
        await new date(detales).save()
        res.json({ a: 'aaa', _id: cart._id });
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

router.get('/getorders/:accessToken/:skip', validateToken2, validatenumber, async (req: any, res) => {
    try {
        let skip = Number(req.params.skip)
        Cart.aggregate([
            { $skip: skip }, { $limit: 30 },
            {
                $lookup: {
                    from: "pantsproducts",
                    localField: "arr.id",
                    foreignField: "_id",
                    as: "pantsProducts", pipeline: [
                        {
                            $project: {
                                _id: 1,
                                src: 1,
                                category2: 1,
                                name: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "shirtsproducts",
                    localField: "arr.id",
                    foreignField: "_id",
                    as: "shirtsProducts", pipeline: [
                        {
                            $project: {
                                _id: 1,
                                src: 1,
                                name: 1,
                                category2: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "shoesproducts",
                    localField: "arr.id",
                    foreignField: "_id",
                    as: "shoesProducts", pipeline: [
                        {
                            $project: {
                                src: 1,
                                _id: 1,
                                category2: 1,
                                name: 1,
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$_id",
                    fullname: { $first: "$fullname" },
                    Email: { $first: "$Email" },
                    Address: { $first: "$Address" },
                    Address2: { $first: "$Address2" },
                    City: { $first: "$City" },
                    Zip: { $first: "$Zip" },
                    date: { $first: "$date" },
                    pricecart: { $first: "$pricecart" },
                    arr: { $first: "$arr" },
                    products: {
                        $push: {
                            $concatArrays: ["$pantsProducts", "$shirtsProducts", "$shoesProducts"]
                        }
                    }
                }
            }
        ]).then((result) => {
            res.json(result);

        })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

export { router as cartRouter };

