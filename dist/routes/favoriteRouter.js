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
import { ObjectId } from "mongodb";
import { validateToken } from "../middleware/validtetoken/validtetoken.js";
import { favorites } from "../db/models/favorites.js";
import { valfavorite } from "../middleware/valfavorite.js";
router.put("/", validateToken, valfavorite, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let arr = JSON.parse(req.body.params.arr);
        let updatedArr = [];
        arr.map((e) => {
            updatedArr.push(new ObjectId(e));
        });
        yield favorites.updateOne({ Email: req.email }, { $set: { arr: updatedArr } });
        res.json('good');
    }
    catch (_a) { }
}));
export { router as favoriteRouter };
