import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { upload } from "../middleware/uplodefile.js";
import fs from "fs";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateCard } from "../middleware/card.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { ObjectId } from "mongodb";
import { validateToken4 } from "../middleware/validtetoken/validtetoken4.js";
router.post('/user-profile/:accessToken', validateToken4, upload, validateCard, async (req: any, res) => {
    try {
        let potos = []
        for (let a = 0; a < req.files.length; a++) {
            potos.push(`${req.protocol}://${req.get('host')}/${req.files[a].filename}`)
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
        }
        if (req.body.setPermissivecategory === 'Shirts') {
            await new Shirtsproduct(item).save()
            res.status(200).json({
                message: "good",
            })
        }
        if (req.body.setPermissivecategory === 'shoes') {
            await new shoesproduct(item).save()
            res.status(200).json({
                message: "good",
            })
        }
        if (req.body.setPermissivecategory === 'pants') {
            await new pantsproduct(item).save()
            res.status(200).json({
                message: "good",
            })
        }

    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

router.delete("/delete/pants", validateToken2, validateObjectid, async (req: any, res) => {
    try {
        await pantsproduct.findOne({ _id: new ObjectId(req.query.id) }, { src: 1, _id: 0 }).then((src: any) => {
            let arr = [...src.src]
            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                    if (err) { }
                });
            }
        })
        await pantsproduct.deleteOne({ _id: new ObjectId(req.query.id) })
            .then((result) => {
                res.json({ id: result, Message: 'susces' });
            })
    } catch (e) { res.status(500).json({ message: `Error: ${e}` }) }
});
router.delete("/delete/Shirts", validateToken2, validateObjectid, async (req: any, res) => {
    try {
        await Shirtsproduct.findOne({ _id: new ObjectId(req.query.id) }, { src: 1, _id: 0 }).then((src: any) => {
            let arr = [...src.src]

            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                    if (err) { }
                });
            }
        })

        await Shirtsproduct.deleteOne({ _id: new ObjectId(req.query.id) })
            .then((result) => {
                res.json({ id: result, Message: 'susces' });
            })
    } catch (e) {
        res.status(500).json({ message: `Error: ${req.query.id}` })
    }

});
router.delete("/delete/shoes", validateToken2, validateObjectid, async (req: any, res) => {
    try {
        await shoesproduct.findOne({ _id: new ObjectId(req.query.id) }, { src: 1, _id: 0 }).then((src: any) => {
            let arr = [...src.src]
            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => { });
            }
        })
        await shoesproduct.deleteOne({ _id: new ObjectId(req.query.id) })
            .then((result) => {
                res.json({ id: result, Message: 'susces' });
            })
    } catch (e) {
        res.status(500).json({ message: `Error: ${e}` })
    }
});


export { router as FileRouter };
