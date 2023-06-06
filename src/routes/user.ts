import { Router } from "express";
import { users } from "../db/models/user.js";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateMail } from "../middleware/validateMail.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { validatenumber } from "../middleware/number/number.js";
import { ObjectId } from "mongodb";
const router = Router();

router.get('/:accessToken/:skip', validateToken2, validatenumber, async (req, res) => {
    try {
        let numberskip = Number(req.params.skip)
        const user = await users.find({}, { username: 1, email: 1, roles: 1 }).limit(100).skip(numberskip);
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});
router.delete('/:id/:accessToken', validateToken2, validateObjectid, async (req, res) => {
    try {
        const user = await users.deleteOne({ _id: new ObjectId(req.params.id) });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }


        return res.status(200).json({ Message: 'susces', id: req.params.id });
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});
router.put('/admin/:id/:accessToken', validateToken2, validateObjectid, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await users.updateOne({ _id: new ObjectId(id) }, { roles: ['admin'] });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }


        return res.status(200).json({ Message: 'susces', user: `${req.params.users}` });
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});
router.put('/user/:id/:accessToken', validateToken2, validateObjectid, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await users.updateOne({ _id: new ObjectId(id) }, { roles: ['user'] });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }


        return res.status(200).json({ Message: 'susces', user: req.params.users });
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});
router.post('/getuser/:accessToken', validateToken2, validateMail, async (req, res) => {
    try {
        const user = await users.findOne({ email: req.body.email }, { username: 1, email: 1, roles: 1 });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }

        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});


export { router as userRouter };
