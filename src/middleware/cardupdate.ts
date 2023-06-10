import { RequestHandler } from "express";
import _ from "underscore";
import { cardUpdateSchema } from "../validators/cards.js";
import fs from "fs";
const validateCard: RequestHandler = (req: any, res, next) => {
    const body = _.pick(req.body, "titel", "brand", "setPermissivecategory", 'categoryselect2', 'description', 'saleprice', 'regularprice', 'fSizeOptions2', 'photos', 'photodelte', 'fcategory', 'id');
    body.photos = JSON.parse(body.photos)
    body.photodelte = JSON.parse(body.photodelte)
    body.fSizeOptions2 = JSON.parse(body.fSizeOptions2)
    if (req.files.length + body.photos.length < 1) {
        for (let a = 0; a < req.files.length; a++) {
            fs.unlink(`./public/${req.files[a].filename}`, (err) => {
                if (err) { }
            });
        }
        return res.status(400).json({
            message: "Validation Failed",
            photo: 'uplode photo'
        });
    }
    const { error } = cardUpdateSchema.validate(body);

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
