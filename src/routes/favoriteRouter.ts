import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import { validateToken } from "../middleware/validtetoken/validtetoken.js";
let project = { $project: { _id: 1, stock: 1, price2: 1, price: 1, category2: 1, category: 1, brand: 1, name: 1, description: 1, src: 1 } }//validateToken
import { favorites } from "../db/models/favorites.js";
router.put("/", validateToken, async (req: any, res) => {
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
