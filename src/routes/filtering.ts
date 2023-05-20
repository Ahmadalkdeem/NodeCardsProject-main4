import { Router } from "express";
const router = Router();
import { pantsproduct, Shirtsproduct, shoesproduct } from "../db/models/product.js";
import { validatenumber } from "../middleware/number.js";
import { Finddate } from "../middleware/find/find.js";
import { validatefind } from "../middleware/find/validatefind.js";

router.get("/shoesproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    shoesproduct.find(req.find).limit(40).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/Shirtsproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)

    Shirtsproduct.find(req.find).limit(40).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});
router.get("/pantsproduct/:skip", validatenumber, validatefind, Finddate, (req: any, res) => {
    let numberskip = Number(req.params.skip)
    pantsproduct.find(req.find).limit(40).skip(numberskip)
        .then((result) => {
            return res.json(result);
        })
        .catch((e) => res.status(500).json({ message: `Error: ${e}` }));
});

export { router as filteringRouter };
