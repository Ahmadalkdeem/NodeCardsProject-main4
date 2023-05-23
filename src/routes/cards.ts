import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { validatenumber } from "../middleware/number/number.js";
import { Finddate } from "../middleware/find/find.js";
import { validatefind } from "../middleware/find/validatefind.js";
import { validateObjectid } from "../middleware/validateObjectid.js";

router.get("/shoesproduct/:skip", validatenumber, (req, res) => {
    let numberskip = Number(req.params.skip)

    shoesproduct.find().limit(1).skip(numberskip)
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/Shirtsproduct/:skip", validatenumber, (req, res) => {
    let numberskip = Number(req.params.skip)
    Shirtsproduct.find().limit(1).skip(numberskip)
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/pantsproduct/:skip", validatenumber, (req, res) => {
    let numberskip = Number(req.params.skip)
    pantsproduct.find().limit(1).skip(numberskip)
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/shoesproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    shoesproduct.find(req.find).limit(40).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/Shirtsproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)

    Shirtsproduct.find(req.find).limit(40).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/pantsproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    pantsproduct.find(req.find).limit(40).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/pants/:id", validateObjectid, (req, res) => {
    let id = req.params.id
    pantsproduct.findOne({ _id: id })
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/Shirts/:id", validateObjectid, (req, res) => {
    let id = req.params.id
    Shirtsproduct.findOne({ _id: id })
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/shoes/:id", validateObjectid, (req, res) => {
    let id = req.params.id
    shoesproduct.findOne({ _id: id })
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
export { router as CardsRouter };
