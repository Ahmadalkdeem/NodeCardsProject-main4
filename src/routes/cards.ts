import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { validatenumber } from "../middleware/number/number.js";
import { Finddate } from "../middleware/find/find.js";
import { validatefind } from "../middleware/find/validatefind.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
let project = { $project: { _id: 1, stock: 1, price2: 1, price: 1, category2: 1, category: 1, brand: 1, name: 1, description: 1, src: 1 } }
router.get("/filtering/shoesproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    shoesproduct.find(req.find).limit(50).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/Shirtsproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)

    Shirtsproduct.find(req.find).limit(50).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/pantsproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    pantsproduct.find(req.find).limit(50).skip(numberskip)
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
router.get("/brands/:skip", validatenumber, validatefind, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    let match = { $match: { brand: req.query.brands[0] } }
    const query: any = [
        match,
        project,
        {
            $unionWith: {
                coll: 'shirtsproducts', pipeline: [
                    match,
                    project
                ]
            }
        },
        {
            $unionWith: {
                coll: 'pantsproducts', pipeline: [
                    match,
                    project
                ]
            }
        }, { $sort: { _id: 1 } }
    ]
    shoesproduct.aggregate(query).then((result) => {
        res.json(result);
    })

});
router.get("/brands/filtering/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    let arr: any[] = []

    if (req.query.sizes !== undefined) {
        const sizes = [];
        req.query.sizes.forEach((e) => {
            sizes.push({ 'stock.size': e });
        })
        if (sizes.length !== 0) { arr.push({ $or: sizes }) }
    }
    if (req.query.colors !== undefined) {
        const colors = [];
        req.query.colors.forEach((e) => {
            colors.push({ 'stock.colors.color': e });
        })
        if (colors.length !== 0) { arr.push({ $or: colors }) }
    }
    if (req.query.brands !== undefined) {
        const brands = [];
        req.query.brands.forEach((e) => {
            brands.push({ brand: e });
        })
        if (brands.length !== 0) { arr.push({ $or: brands }) }
    }
    let match = {
        $match: {
            $and: arr
        }
    }
    const query: any = [
        match,
        project,
        {
            $unionWith: {
                coll: 'shirtsproducts', pipeline: [
                    match,
                    project
                ]
            }
        },
        {
            $unionWith: {
                coll: 'pantsproducts', pipeline: [
                    match,
                    project
                ]
            }
        }, { $sort: { _id: 1 } }
    ]
    shoesproduct.aggregate(query).then((result) => {
        res.json(result);
    }).catch((e) => {

        res.status(400).json(query);
    })
});
export { router as CardsRouter };
