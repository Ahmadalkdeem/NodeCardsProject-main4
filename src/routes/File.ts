import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { upload } from "../middleware/uplodefile.js";
import fs from "fs";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateCard } from "../middleware/card.js";
import { validateObjectid } from "../middleware/validateObjectid.js";

router.post('/user-profile/:accessToken', validateToken2, upload, validateCard, async (req: any, res) => {
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

router.delete("/delete/pants/:id/:accessToken", validateToken2, validateObjectid, async (req, res) => {
    try {
        await pantsproduct.findOne({ _id: req.params.id }, { src: 1, _id: 0 }).then((src: any) => {
            let arr = [...src.src]
            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                    if (err) { }
                });
            }
        })
        await pantsproduct.deleteOne({ _id: req.params.id })
            .then((result) => {
                res.json({ id: result, Message: 'susces' });
            })
    } catch (e) { res.status(500).json({ message: `Error: ${e}` }) }
});
router.delete("/delete/Shirts/:id/:accessToken", validateToken2, validateObjectid, async (req, res) => {
    try {
        await Shirtsproduct.findOne({ _id: req.params.id }, { src: 1, _id: 0 }).then((src: any) => {
            let arr = [...src.src]

            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => {
                    if (err) { }
                });
            }
        })

        await Shirtsproduct.deleteOne({ _id: req.params.id })
            .then((result) => {
                res.json({ id: result, Message: 'susces' });
            })
    } catch (e) {
        res.status(500).json({ message: `Error: ${e}` })
    }

});
router.delete("/delete/shoes/:id/:accessToken", validateToken2, validateObjectid, async (req, res) => {
    try {
        await shoesproduct.findOne({ _id: req.params.id }, { src: 1, _id: 0 }).then((src: any) => {
            let arr = [...src.src]
            for (let a = 0; a < arr.length; a++) {
                fs.unlink(`./public/${arr[a].split('/').pop()}`, (err) => { });
            }
        })
        await shoesproduct.deleteOne({ _id: req.params.id })
            .then((result) => {
                res.json({ id: result, Message: 'susces' });
            })
    } catch (e) {
        res.status(500).json({ message: `Error: ${e}` })
    }
});


export { router as FileRouter };
