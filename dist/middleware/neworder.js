import { ObjectId } from "mongodb";
const neworder = (req, res, next) => {
    let arr = [];
    JSON.parse(req.body.cart).forEach(element => {
        arr.push({ id: new ObjectId(element.id), color: element.color, sizeselect: element.sizeselect, quantity: element.quantity });
    });
    req.arr = arr;
    next();
};
export { neworder };
