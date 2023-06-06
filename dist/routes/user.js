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
import { users } from "../db/models/user.js";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateMail } from "../middleware/validateMail.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { validatenumber } from "../middleware/number/number.js";
import { ObjectId } from "mongodb";
const router = Router();
router.get('/:accessToken/:skip', validateToken2, validatenumber, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let numberskip = Number(req.params.skip);
        const user = yield users.find({}, { username: 1, email: 1, roles: 1 }).limit(100).skip(numberskip);
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        return res.status(200).json(user);
    }
    catch (e) {
        return res.status(500).json({ message: "server error", error: e });
    }
}));
router.delete('/:id/:accessToken', validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users.deleteOne({ _id: new ObjectId(req.params.id) });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        return res.status(200).json({ Message: 'susces', id: req.params.id });
    }
    catch (e) {
        return res.status(500).json({ message: "server error", error: e });
    }
}));
router.put('/admin/:id/:accessToken', validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield users.updateOne({ _id: new ObjectId(id) }, { roles: ['admin'] });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        return res.status(200).json({ Message: 'susces', user: `${req.params.users}` });
    }
    catch (e) {
        return res.status(500).json({ message: "server error", error: e });
    }
}));
router.put('/user/:id/:accessToken', validateToken2, validateObjectid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield users.updateOne({ _id: new ObjectId(id) }, { roles: ['user'] });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        return res.status(200).json({ Message: 'susces', user: req.params.users });
    }
    catch (e) {
        return res.status(500).json({ message: "server error", error: e });
    }
}));
router.post('/getuser/:accessToken', validateToken2, validateMail, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users.findOne({ email: req.body.email }, { username: 1, email: 1, roles: 1 });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        return res.status(200).json(user);
    }
    catch (e) {
        return res.status(500).json({ message: "server error", error: e });
    }
}));
export { router as userRouter };
