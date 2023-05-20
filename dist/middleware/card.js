import _ from "underscore";
import { cardSchema } from "../validators/cards.js";
import fs from "fs";
const validateCard = (req, res, next) => {
    const body = _.pick(req.body, "titel", "brand", "setPermissivecategory", 'categoryselect2', 'description', 'saleprice', 'regularprice', 'fSizeOptions2');
    body.fSizeOptions2 = JSON.parse(body.fSizeOptions2);
    const { error } = cardSchema.validate(body);
    if (error) {
        for (let a = 0; a < req.files.length; a++) {
            fs.unlink(`./public/${req.files[a].filename}`, (err) => {
                if (err) { }
            });
        }
        return res.status(400).json({
            message: "Validation Failed",
            body: body,
            errors: error,
        });
    }
    next();
};
export { validateCard };
