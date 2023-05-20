import _ from "underscore";
import { orderSchema } from "../validators/order.js";
const validateorder = (req, res, next) => {
    const body = _.pick(req.body, "fullname", "Email", "Address", 'Address2', 'City', 'Zip', 'cart');
    body.cart = JSON.parse(req.body.cart);
    let item = {
        fullname: req.body.fullname,
        Email: req.body.Email,
        Address: req.body.Address,
        Address2: req.body.Address2,
        City: req.body.City,
        Zip: req.body.Zip,
        arr: JSON.parse(req.body.cart)
    };
    const { error } = orderSchema.validate(item);
    if (error) {
        return res.status(400).json({
            message: "Validation Failed",
            body: body,
            errors: error.details.map((ed) => ed.message),
        });
    }
    next();
};
export { validateorder };
