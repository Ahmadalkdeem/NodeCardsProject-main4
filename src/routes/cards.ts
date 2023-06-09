import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { validatenumber } from "../middleware/number/number.js";
import { Finddate } from "../middleware/find/find.js";
import { validatefind } from "../middleware/find/validatefind.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
let project = { $project: { _id: 1, stock: 1, price2: 1, price: 1, category2: 1, category: 1, brand: 1, name: 1, description: 1, src: 1 } }
router.get("/filtering/shoesproduct", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    shoesproduct.find(req.find).limit(50).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/Shirtsproduct", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)

    Shirtsproduct.find(req.find).limit(50).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/filtering/pantsproduct", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    pantsproduct.find(req.find).limit(50).skip(numberskip)
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
        { $limit: 100 }
    ]).then((result) => {
        res.json(result);

    })


});
router.get("/brands/filtering", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.query.skip)
    let arr: any[] = [];

    if (req.query.sizes !== undefined) {
        const sizes = [];
        req.query.sizes.forEach((e) => {
            sizes.push({ 'stock.size': e });
        });
        if (sizes.length !== 0) {
            arr.push({ $or: sizes });
        }
    }
    if (req.query.categorys !== undefined) {
        const categorys = [];
        req.query.categorys.forEach((e) => {
            categorys.push({ category: e });
        });
        if (categorys.length !== 0) {
            arr.push({ $or: categorys });
        }
    }
    if (req.query.categorys2 !== undefined) {
        const categorys2 = [];
        req.query.categorys2.forEach((e) => {
            categorys2.push({ category2: e });
        });
        if (categorys2.length !== 0) {
            arr.push({ $or: categorys2 });
        }
    }

    if (req.query.colors !== undefined) {
        const colors = [];
        req.query.colors.forEach((e) => {
            colors.push({ category: e });
        });
        if (colors.length !== 0) {
            arr.push({ $or: colors });
        }
    }

    if (req.query.brands !== undefined) {
        const brands = [];
        req.query.brands.forEach((e) => {
            brands.push({ brand: e });
        });
        if (brands.length !== 0) {
            arr.push({ $or: brands });
        }
    }

    let match: any = {};
    if (arr.length !== 0) {
        match = { $match: { $and: arr } };
    }

    const query: any = [
        { $unionWith: { coll: "shirtsproducts" } },
        { $unionWith: { coll: "pantsproducts" } },
        match,
        { $sort: { _id: 1 } },
        { $skip: numberskip },
        { $limit: 100 },
    ];

    shoesproduct.aggregate(query).then((result) => {
        res.json(result);
    }).catch((e) => {

        res.status(400).json(query);
    })
});
export { router as CardsRouter };
