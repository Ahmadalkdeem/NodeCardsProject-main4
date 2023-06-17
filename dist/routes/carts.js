var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
const router = Router();
import { Carts } from "../db/models/cart.js";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateorder } from "../middleware/order.js";
import { neworder } from "../middleware/neworder.js";
import nodemailer from 'nodemailer';
import { skip } from "../middleware/valNumber/skip.js";
import authConfig from "../db/config/auth.config.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { ObjectId } from "mongodb";
import { schemaMail } from "../validators/validateMail.js";
let pipeline = [
    {
        $project: {
            src: 1,
            _id: 1,
            brand: 1,
            category: 1,
            name: 1,
        }
    }
];
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
    }];
router.post('/neworder', validateorder, neworder, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let detales = {
            date: new Date(),
            pricecart: req.body.pricecart
        };
        let arr = Object.assign({ fullname: req.body.fullname, Email: req.body.Email, Address: req.body.Address, Address2: req.body.Address2, City: req.body.City, Zip: req.body.Zip, arr: req.arr, status: false }, detales);
        let cart = yield new Carts(arr).save();
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
        yield transporter.sendMail(message, function (error, info) {
            if (error) {
                res.status(400).json({ error: error, ahmad: 'ahmad' });
            }
            else {
                res.status(200).json({ good: 'good' });
                console.log('Email sent: ');
            }
        });
        res.json({ a: 'aaa' });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.get('/getorders', validateToken2, skip, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let skip = Number(req.query.skip);
        Carts.aggregate([
            { $match: { status: false } },
            { $skip: skip },
            { $limit: 150 },
            ...aggregte,
            { $sort: { _id: 1 } }
        ]).then((result) => {
            res.json(result);
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.put('/putoneorder', validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Carts.updateOne({ _id: new ObjectId(req.body.params.id) }, { $set: { status: true } }).then((e) => {
            res.json({ good: 'good', id: req.body.params.id });
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.get('/getoneorder', validateToken2, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = schemaMail.validate({ email: req.query.email });
        if (error) {
            return res.status(400).json({
                message: "email Failed",
                errors: error.details.map((ed) => ed.message),
            });
        }
        Carts.aggregate([
            { $match: { Email: req.query.email } },
            ...aggregte,
            { $sort: { _id: -1 } }
        ]).then((e) => {
            res.json(e);
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.get('/getoneorderId', validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Carts.aggregate([
            { $match: { _id: new ObjectId(req.query.id) } },
            ...aggregte,
            { $limit: 1 }
        ]).then((e) => {
            res.json(e);
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.delete('/delate', validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Carts.deleteOne({ _id: new ObjectId(req.query.id) }).then((e) => {
            res.json({ Message: 'susces' });
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
export { router as cartRouter };
