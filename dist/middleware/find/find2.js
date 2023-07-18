var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Find2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        else if (req.query.sizes !== undefined && req.query.colors === undefined) {
            const sizes = req.query.sizes.map((size) => ({
                'stock.size': size
            }));
            pipeline.push({ $or: sizes });
        }
        else if (req.query.colors !== undefined && req.query.sizes === undefined) {
            const colors = req.query.colors.map((color) => ({
                'stock.colors.color': color
            }));
            pipeline.push({ $or: colors });
        }
        if (req.query.categorys !== undefined) {
            const categorys = req.query.categorys.map((category) => ({
                category: category
            }));
            pipeline.push({ $or: categorys });
        }
        if (req.query.categorys2 !== undefined) {
            const categorys2 = req.query.categorys2.map((category2) => ({
                category2: category2
            }));
            pipeline.push({ $or: categorys2 });
        }
        if (req.query.brands !== undefined) {
            const brands = req.query.brands.map((brand) => ({
                brand: brand
            }));
            pipeline.push({ $or: brands });
        }
        req.find = pipeline;
        next();
    }
    catch (e) {
        res.status(400).json({ e: e, qwer: req.query });
        return;
    }
});
export { Find2 };
