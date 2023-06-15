import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { validatenumber } from "../middleware/number/number.js";
import { Finddate } from "../middleware/find/find.js";
import { validatefind } from "../middleware/find/validatefind.js";
import { validateObjectid } from "../middleware/validateObjectid.js";

router.get("/filtering/shoesproduct", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.query.skip)
    shoesproduct.find(req.find).limit(1).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/Shirtsproduct", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.query.skip)
    Shirtsproduct.find(req.find).limit(1).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/pantsproduct", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.query.skip)
    pantsproduct.find(req.find).limit(1).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/pants", validateObjectid, (req, res) => {
    let id = req.query.id
    pantsproduct.findOne({ _id: id })
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/Shirts", validateObjectid, (req, res) => {
    let id = req.query.id
    Shirtsproduct.findOne({ _id: id })
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/shoes", validateObjectid, (req, res) => {
    let id = req.query.id
    shoesproduct.findOne({ _id: id })
        .then((result) => {
            res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/brands", validatenumber, validatefind, (req: any, res) => {
    let numberskip = Number(req.query.skip)
    shoesproduct.aggregate([
        { $unionWith: { coll: "shirtsproducts" } },
        { $unionWith: { coll: "pantsproducts" } },
        { $match: { brand: req.query.brands[0] } },
        { $sort: { _id: 1 } },
        { $skip: numberskip },
        { $limit: 1 }
    ]).then((result) => {
        res.json(result);

    })


});
router.get("/brands/filtering", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.query.skip)
    const pipeline = [];

    if (req.query.sizes !== undefined && req.query.colors !== undefined) {
        const sizesAndColors = [];
        req.query.sizes.forEach((size) => {
            const colorFilter = req.query.colors.map((color) => ({
                'stock': {
                    $elemMatch: {
                        size: size,
                        'colors.color': color
                    }
                }
            }));
            sizesAndColors.push({ $or: colorFilter });
        });
        pipeline.push({ $or: sizesAndColors });
    } else if (req.query.sizes !== undefined && req.query.colors === undefined) {
        const sizes = req.query.sizes.map((size) => ({
            'stock.size': size
        }));
        pipeline.push({ $or: sizes });
    } else if (req.query.colors !== undefined && req.query.sizes === undefined) {
        const colors = req.query.colors.map((color) => ({
            'stock.colors.color': color
        }));
        pipeline.push({ $or: colors });
    }

    if (req.query.categorys !== undefined) {
        const categorys = req.query.categorys.map((category) => ({
            category: category
        }));
        pipeline.push({ $or: categorys });
    }

    if (req.query.categorys2 !== undefined) {
        const categorys2 = req.query.categorys2.map((category2) => ({
            category2: category2
        }));
        pipeline.push({ $or: categorys2 });
    }

    if (req.query.brands !== undefined) {
        const brands = req.query.brands.map((brand) => ({
            brand: brand
        }));
        pipeline.push({ $or: brands });
    }

    const match = { $match: { $and: pipeline } };
    const query: any = [
        { $unionWith: { coll: "shirtsproducts" } },
        { $unionWith: { coll: "pantsproducts" } },
        match,
        { $sort: { _id: 1 } },
        { $skip: numberskip },
        { $limit: 1 },
    ];

    shoesproduct.aggregate(query).then((result) => {
        res.json(result);
    }).catch((e) => {

        res.status(400).json(query);
    })
});
export { router as CardsRouter };
