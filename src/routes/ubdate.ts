import { Router } from "express";
const router = Router();
import _ from "underscore";
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { upload } from "../middleware/uplodefile.js";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateCard } from "../middleware/cardupdate.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { ObjectId } from "mongodb";
import fs from "fs";
router.put('/:id/:accessToken', validateToken2, validateObjectid, upload, validateCard, async (req: any, res) => {
    try {
        let arr = JSON.parse(req.body.photodelte)
        for (let a = 0; a < arr.length; a++) {
            fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                if (err) {

                }

            });

        }
        let potos = []
        for (let a = 0; a < req.files.length; a++) {
            potos.push(`${req.protocol}://${req.get('host')}/${req.files[a].filename}`)
        }
        let stock = JSON.parse(req.body.fSizeOptions2)
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
        }
        if (req.body.fcategory === req.body.setPermissivecategory) {
            if (req.body.setPermissivecategory === 'shoes') {
                await shoesproduct.replaceOne({ _id: new ObjectId(req.params.id) }, item)
                res.status(200).json({
                    message: "good",
                })
            }
            if (req.body.setPermissivecategory === 'pants') {
                await pantsproduct.replaceOne({ _id: new ObjectId(req.params.id) }, item)
                res.status(200).json({
                    message: "good",
                })
            }

            if (req.body.setPermissivecategory === 'Shirts') {
                await Shirtsproduct.replaceOne({ _id: new ObjectId(req.params.id) }, item)
                res.status(200).json({
                    message: "good",
                })
            }
        }
        else if (req.body.fcategory !== req.body.setPermissivecategory) {


            if (req.body.fcategory === 'shoes') {
                await shoesproduct.deleteOne({ _id: new ObjectId(req.params.id) })
            }
            if (req.body.fcategory === 'pants') {
                await pantsproduct.deleteOne({ _id: new ObjectId(req.params.id) })
            }

            if (req.body.fcategory === 'Shirts') {
                await Shirtsproduct.deleteOne({ _id: new ObjectId(req.params.id) })
            }
            if (req.body.setPermissivecategory === 'Shirts') {
                await new Shirtsproduct(item).save()
                res.status(200).json({
                    message: "good",
                    src: potos,
                })
            }
            if (req.body.setPermissivecategory === 'shoes') {
                await new shoesproduct(item).save()
                res.status(200).json({
                    message: "good",
                    src: potos,
                })
            }
            if (req.body.setPermissivecategory === 'pants') {
                await new pantsproduct(item).save()
                res.status(200).json({
                    message: "good",
                    src: potos,
                })
            }
        }

    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

export { router as UpdatecardRouter };
