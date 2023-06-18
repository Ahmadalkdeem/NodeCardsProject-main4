import { Router } from "express";
import { users } from "../db/models/user.js";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validateMail } from "../middleware/validateMail.js";
import { validateObjectid } from "../middleware/validateObjectid.js";
import { skip } from "../middleware/valNumber/skip.js";
import { favorites } from "../db/models/favorites.js";
import { ObjectId } from "mongodb";
const router = Router();

router.get('/', validateToken2, skip, async (req, res) => {
    try {
        let numberskip = Number(req.query.skip)
        const user = await users.find({}, { username: 1, email: 1, roles: 1 }).limit(150).skip(numberskip);
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});
router.get('/getuser', validateToken2, validateMail, async (req, res) => {
    try {
        const user = await users.findOne({ email: req.query.email }, { username: 1, email: 1, roles: 1 });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }

        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});
router.delete('/', validateToken2, validateMail, async (req: any, res) => {
    try {
        const user = await users.deleteOne({ email: req.query.email });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }
        const favorite = await favorites.deleteOne({ Email: req.query.email });
        if (!favorite) {
        }


        return res.status(200).json({ Message: 'susces', id: req.query.id });
    } catch (e) {
        return res.status(500).json({ message: req.query, error: e })
    }
});
router.put('/admin', validateToken2, validateObjectid, async (req, res) => {
    try {
        const id: any = req.body.params.id;
        const user = await users.updateOne({ _id: new ObjectId(id) }, { roles: ['admin'] });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }


        return res.status(200).json({ Message: 'susces', user: `${req.params.users}` });
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});
router.put('/user', validateToken2, validateObjectid, async (req, res) => {
    try {
        const id: any = req.body.params.id;
        const user = await users.updateOne({ _id: new ObjectId(id) }, { roles: ['user'] });
        if (!user) {
            return res.status(401).json({ message: "No Such User" });
        }


        return res.status(200).json({ Message: 'susces', user: req.params.users });
    } catch (e) {
        return res.status(500).json({ message: "server error", error: e })
    }
});

export { router as userRouter };
