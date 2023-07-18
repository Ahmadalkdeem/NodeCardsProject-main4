import { RequestHandler } from "express";
const Finddate: RequestHandler = async (req: any, res, next) => {
    try {
        const pipeline = [];

        if (req.query.sizes !== undefined && req.query.colors !== undefined) {
            const sizesAndColors = [];
            req.query.sizes.forEach((size) => {
                const colorFilter = req.query.colors.map((color) => ({
                    'stock': {
                        $elemMatch: {
                            size: size,
                            'colors.color': color
                        }
                    }
                }));
                sizesAndColors.push({ $or: colorFilter });
            });
            pipeline.push({ $or: sizesAndColors });
        }

        const sizes = [];
        if (req.query.sizes !== undefined && req.query.colors === undefined) {
            req.query.sizes.forEach((e) => {
                sizes.push({ 'stock.size': e });
            })
        }
        const colors = [];
        if (req.query.colors !== undefined && req.query.sizes !== undefined) {
            req.query.colors.forEach((e) => {
                colors.push({ 'stock.colors.color': e });
            })
        }
        const categorys = [];
        if (req.query.categorys !== undefined) {
            req.query.categorys.forEach((e) => {
                categorys.push({ category: e });
            })
        }
        const categorys2 = [];
        if (req.query.categorys2 !== undefined) {
            req.query.categorys2.forEach((e) => {
                categorys2.push({ category2: e });
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
                        { $or: pipeline },
                        { $or: sizes },
                        { $or: brands },
                        { $or: colors },
                        { $or: categorys },
                        { $or: categorys2 },
                    ]
                }
            ]
        };
        req.find = x
        next()
    } catch (e) {

        res.status(400).json({ e: e, qwer: req.query });
        return
    }
};
export { Finddate }