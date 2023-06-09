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
import { validateToken4 } from "../middleware/validtetoken/validtetoken4.js";
import { validateCard } from "../middleware/cardupdate.js";
import { ObjectId } from "mongodb";
import fs from "fs";
router.put('/:accessToken', validateToken4, upload, validateCard, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let arr = JSON.parse(req.body.photodelte);
        for (let a = 0; a < arr.length; a++) {
            fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                if (err) {
                }
            });
        }
        let potos = [];
        for (let a = 0; a < req.files.length; a++) {
            potos.push(`${req.protocol}://${req.get('host')}/${req.files[a].filename}`);
        }
        let stock = JSON.parse(req.body.fSizeOptions2);
        const item = {
            src: [...potos, ...JSON.parse(req.body.photos)],
            description: req.body.description,
            name: req.body.titel,
            brand: req.body.brand,
            category: req.body.setPermissivecategory,
            category2: req.body.categoryselect2,
            price: req.body.saleprice,
            price2: req.body.regularprice,
            stock: stock
        };
        if (req.body.fcategory === req.body.setPermissivecategory) {
            if (req.body.setPermissivecategory === 'shoes') {
                yield shoesproduct.replaceOne({ _id: new ObjectId(req.body.id) }, item);
                return res.status(200).json(item);
            }
            if (req.body.setPermissivecategory === 'pants') {
                yield pantsproduct.replaceOne({ _id: new ObjectId(req.body.id) }, item);
                return res.status(200).json(item);
            }
            if (req.body.setPermissivecategory === 'Shirts') {
                yield Shirtsproduct.replaceOne({ _id: new ObjectId(req.body.id) }, item);
                return res.status(200).json(item);
            }
        }
        else if (req.body.fcategory !== req.body.setPermissivecategory) {
            if (req.body.fcategory === 'shoes') {
                yield shoesproduct.deleteOne({ _id: new ObjectId(req.body.id) });
            }
            if (req.body.fcategory === 'pants') {
                yield pantsproduct.deleteOne({ _id: new ObjectId(req.body.id) });
            }
            if (req.body.fcategory === 'Shirts') {
                yield Shirtsproduct.deleteOne({ _id: new ObjectId(req.body.id) });
            }
            if (req.body.setPermissivecategory === 'Shirts') {
                yield new Shirtsproduct(item).save();
                return res.status(200).json(item);
            }
            if (req.body.setPermissivecategory === 'shoes') {
                yield new shoesproduct(item).save();
                return res.status(200).json(item);
            }
            if (req.body.setPermissivecategory === 'pants') {
                yield new pantsproduct(item).save();
                return res.status(200).json(item);
            }
        }
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
export { router as UpdatecardRouter };
