var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Finddate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let item = {
            price: [20, 200]
        };
        const sizes = [];
        if (req.query.sizes !== undefined) {
            req.query.sizes.forEach((e) => {
                sizes.push({ 'stock.size': e });
            });
        }
        const colors = [];
        if (req.query.colors !== undefined) {
            req.query.colors.forEach((e) => {
                colors.push({ 'stock.colors.color': e });
            });
        }
        const brands = [];
        if (req.query.brands !== undefined) {
            req.query.brands.forEach((e) => {
                brands.push({ brand: e });
            });
        }
        let x = {
            $or: [
                {
                    $and: [
                        { $or: sizes },
                        { $or: brands },
                        { $or: colors }
                    ]
                },
            ],
            // price: { $gt: item.price[0], $lt: item.price[1] }
        };
        req.find = x;
        next();
    }
    catch (e) {
        res.status(400).json({ e: e, qwer: req.query });
        return;
    }
});
export { Finddate };
