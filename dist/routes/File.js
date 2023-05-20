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
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { upload } from "../middleware/uplodefile.js";
import fs from "fs";
import { validateToken2 } from "../middleware/validtetoken2.js";
import { validateCard } from "../middleware/card.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { validatenumber } from "../middleware/number.js";
router.post('/user-profile/:accessToken', validateToken2, upload, validateCard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let potos = [];
        for (let a = 0; a < req.files.length; a++) {
            potos.push(`${req.protocol}://${req.get('host')}/${req.files[a].filename}`);
        }
        let item = {
            src: potos,
            description: req.body.description,
            name: req.body.titel,
            brand: req.body.brand,
            category: req.body.setPermissivecategory,
            category2: req.body.categoryselect2,
            price: req.body.saleprice,
            price2: req.body.regularprice,
            stock: JSON.parse(req.body.fSizeOptions2)
        };
        if (req.body.setPermissivecategory === 'Shirts') {
            yield new Shirtsproduct(item).save();
            res.status(200).json({
                message: "good",
            });
        }
        if (req.body.setPermissivecategory === 'shoes') {
            yield new shoesproduct(item).save();
            res.status(200).json({
                message: "good",
            });
        }
        if (req.body.setPermissivecategory === 'pants') {
            yield new pantsproduct(item).save();
            res.status(200).json({
                message: "good",
            });
        }
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.delete("/delete/pants/:id/:accessToken", validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pantsproduct.findOne({ _id: req.params.id }, { src: 1, _id: 0 }).then((src) => {
            let arr = [...src.src];
            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                    if (err) { }
                });
            }
        });
        yield pantsproduct.deleteOne({ _id: req.params.id })
            .then((result) => {
            res.json({ id: result, Message: 'susces' });
        });
    }
    catch (e) {
        res.status(500).json({ message: `Error: ${e}` });
    }
}));
router.delete("/delete/Shirts/:id/:accessToken", validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Shirtsproduct.findOne({ _id: req.params.id }, { src: 1, _id: 0 }).then((src) => {
            let arr = [...src.src];
            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                    if (err) { }
                });
            }
        });
        yield Shirtsproduct.deleteOne({ _id: req.params.id })
            .then((result) => {
            res.json({ id: result, Message: 'susces' });
        });
    }
    catch (e) {
        res.status(500).json({ message: `Error: ${e}` });
    }
}));
router.delete("/delete/shoes/:id/:accessToken", validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield shoesproduct.findOne({ _id: req.params.id }, { src: 1, _id: 0 }).then((src) => {
            let arr = [...src.src];
            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => { });
            }
        });
        yield shoesproduct.deleteOne({ _id: req.params.id })
            .then((result) => {
            res.json({ id: result, Message: 'susces' });
        });
    }
    catch (e) {
        res.status(500).json({ message: `Error: ${e}` });
    }
}));
router.get("/shoesproduct/:skip", validatenumber, (req, res) => {
    let numberskip = Number(req.params.skip);
    shoesproduct.find().limit(40).skip(numberskip)
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/Shirtsproduct/:skip", validatenumber, (req, res) => {
    let numberskip = Number(req.params.skip);
    Shirtsproduct.find().limit(40).skip(numberskip)
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/pantsproduct/:skip", validatenumber, (req, res) => {
    let numberskip = Number(req.params.skip);
    pantsproduct.find().limit(40).skip(numberskip)
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/pants/:id", validateObjectid, (req, res) => {
    let id = req.params.id;
    pantsproduct.findOne({ _id: id })
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/Shirts/:id", validateObjectid, (req, res) => {
    let id = req.params.id;
    Shirtsproduct.findOne({ _id: id })
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/findOne/shoes/:id", validateObjectid, (req, res) => {
    let id = req.params.id;
    shoesproduct.findOne({ _id: id })
        .then((result) => {
        res.json(result);
    })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
export { router as FileRouter };
