import { Router } from "express";
const router = Router();
import _ from "underscore";
import { Cart } from "../db/models/cart.js";
import { date } from '../db/models/date.js'
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateorder } from "../middleware/order.js";
import { neworder } from "../middleware/neworder.js";
import nodemailer from 'nodemailer'
import { validatenumber } from "../middleware/number/number.js";
import authConfig from "../db/config/auth.config.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { ObjectId } from "mongodb";
let pipeline = [
    {
        $project: {
            src: 1,
            _id: 1,
            category2: 1,
            name: 1,
        }
    }
]
let aggregte = [{
    $lookup: {
        from: "pantsproducts",
        localField: "arr.id",
        foreignField: "_id",
        as: "pantsProducts",
        pipeline: pipeline
    }
},
{
    $lookup: {
        from: "shirtsproducts",
        localField: "arr.id",
        foreignField: "_id",
        as: "shirtsProducts",
        pipeline: pipeline
    }
},
{
    $lookup: {
        from: "shoesproducts",
        localField: "arr.id",
        foreignField: "_id",
        as: "shoesProducts",
        pipeline: pipeline
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
        status: { $first: "$status" },
        arr: { $first: "$arr" },
        products: {
            $push: {
                $concatArrays: ["$pantsProducts", "$shirtsProducts", "$shoesProducts"]
            }
        }
    }
}]

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
            status: false,
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
            // { $match: { status: false } },
            { $skip: skip },
            { $limit: 30 },
            ...aggregte,
            { $sort: { _id: -1 } }
        ]).then((result) => {
            res.json(result);

        })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

router.put('/putoneorder/:accessToken/:id', validateToken2, validateObjectid, async (req: any, res) => {
    try {
        Cart.updateOne({ _id: req.params.id }, { $set: { status: true } }).then((e) => {
            res.json({ good: 'good' })
        })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})
router.get('/getoneorder/:accessToken/:id', validateToken2, validateObjectid, async (req: any, res) => {
    try {
        Cart.aggregate([
            { $match: { _id: new ObjectId(req.params.id) } },
            { $limit: 1 },
            ...aggregte
        ]).then((e) => {
            res.json(e)
        })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

export { router as cartRouter };

