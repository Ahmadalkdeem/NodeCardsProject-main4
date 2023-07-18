var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
const directoryPath = './public';
import { Shirtsproduct } from '../../db/models/product.js';
import corn from 'node-cron';
const file = () => __awaiter(void 0, void 0, void 0, function* () {
    corn.schedule('0 0 1 * *', () => __awaiter(void 0, void 0, void 0, function* () {
        let srs = yield Shirtsproduct.aggregate([
            { $unionWith: { coll: "shoesproducts", pipeline: [{ $project: { _id: 0, src: 1 } }] } },
            { $unionWith: { coll: "pantsproducts", pipeline: [{ $project: { _id: 0, src: 1 } }] } },
            { $project: { _id: 0, src: 1 } },
            { $unwind: "$src" },
            { $group: { _id: null, srcs: { $push: "$src" } } },
            {
                $project: {
                    _id: 0,
                    srcs: {
                        $map: {
                            input: "$srcs",
                            as: "src",
                            in: { $arrayElemAt: [{ $split: ["$$src", "http://localhost:3001/"] }, 1] }
                        }
                    }
                }
            }
        ]);
        fs.readdir(directoryPath, function async(err, fileList) {
            try {
                if (err) {
                    console.log('Error getting directory information:', err);
                }
                else {
                    fileList.forEach(function (file) {
                        if (!srs[0].srcs.includes(file)) {
                            fs.unlink(`${directoryPath}/${file}`, function (err) {
                                if (err)
                                    throw err;
                                console.log(`${file} deleted!`);
                            });
                        }
                    });
                }
            }
            catch (e) {
            }
        });
    }));
});
export { file as fileTest };
