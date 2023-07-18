import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import { validateToken } from "../middleware/validtetoken/validtetoken.js";
import { favorites } from "../db/models/favorites.js";
import { valfavorite } from "../middleware/valfavorite.js";
router.put("/", validateToken, valfavorite, async (req: any, res) => {
    try {
        let arr = JSON.parse(req.body.params.arr)
        let updatedArr = []
        arr.map((e) => {
            updatedArr.push(new ObjectId(e))
        })
        await favorites.updateOne({ Email: req.email }, { $set: { arr: updatedArr } })
        res.json('good')
    } catch { }
});

export { router as favoriteRouter };
