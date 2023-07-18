import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { skip } from "../middleware/valNumber/skip.js";
import { Finddate } from "../middleware/find/find.js";
import { validatefind } from "../middleware/find/validatefind.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { Find2 } from "../middleware/find/find2.js";
router.get("/filtering/shoesproduct", validatefind, skip, Finddate, (req, res) => {
    let numberskip = Number(req.query.skip);
    shoesproduct.find(req.find).limit(150).skip(numberskip)
        .then((result) => {
        return res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/Shirtsproduct", validatefind, skip, Finddate, (req, res) => {
    let numberskip = Number(req.query.skip);
    Shirtsproduct.find(req.find).limit(150).skip(numberskip)
        .then((result) => {
        return res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/pantsproduct", validatefind, skip, Finddate, (req, res) => {
    let numberskip = Number(req.query.skip);
    pantsproduct.find(req.find).limit(150).skip(numberskip)
        .then((result) => {
        return res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/pants", validateObjectid, (req, res) => {
    let id = req.query.id;
    pantsproduct.findOne({ _id: id })
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/Shirts", validateObjectid, (req, res) => {
    let id = req.query.id;
    Shirtsproduct.findOne({ _id: id })
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/shoes", validateObjectid, (req, res) => {
    let id = req.query.id;
    shoesproduct.findOne({ _id: id })
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/brands/filtering", validatefind, skip, Find2, (req, res) => {
    let numberskip = Number(req.query.skip);
    const match = { $match: { $and: req.find } };
    const query = [
        { $unionWith: { coll: "shirtsproducts" } },
        { $unionWith: { coll: "pantsproducts" } },
        match,
        { $sort: { _id: 1 } },
        { $skip: numberskip },
        { $limit: 150 },
    ];
    shoesproduct.aggregate(query).then((result) => {
        res.json(result);
    }).catch((e) => {
        res.status(400).json(query);
    });
});
export { router as CardsRouter };
