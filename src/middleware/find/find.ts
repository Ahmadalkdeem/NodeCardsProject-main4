import { RequestHandler } from "express";
const Finddate: RequestHandler = async (req: any, res, next) => {
    try {
        let item = {
            size: ['S', 'XL'],
            color: ['Pink', 'Yellow'],
            brand: ['Louis Vuitton', `Victoria's Secret`],
            price: [20, 200]
        }
        const sizes = [];
        if (req.query.sizes !== undefined) {
            req.query.sizes.forEach((e) => {
                sizes.push({ 'stock.size': e });
            })
        }
        const colors = [];
        if (req.query.colors !== undefined) {
            req.query.colors.forEach((e) => {
                colors.push({ 'stock.colors.color': e });
            })
        }
        const brands = [];
        if (req.query.brands !== undefined) {
            req.query.brands.forEach((e) => {
                brands.push({ brand: e });
            })
        }


        let x: any = {
            $or: [
                {
                    $and: [
                        { $or: sizes },
                        { $or: brands },
                        { $or: colors }
                    ]
                },
            ],
            price: { $gt: item.price[0], $lt: item.price[1] }
        };
        req.find = x

        // return res.json({ result: x });//, find: req.find   , query: req.query

        next()
    } catch (e) {
        console.log("my error", e);
        console.log(req.query);
        res.status(400).json({ e: e, qwer: req.query });//, find: req.find   , query: req.query
        return
    }
};
export { Finddate }