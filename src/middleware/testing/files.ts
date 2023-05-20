import fs from 'fs'
const files = ['file1.jpg', 'file2.jpg', 'file3.jpg'];
const directoryPath = './public';
import { Shirtsproduct, pantsproduct, shoesproduct } from '../../db/models/product.js';
import corn from 'node-cron'

const corn2 = async () => {
    corn.schedule('0 0 1 * *', async () => {

        let srs = await Shirtsproduct.aggregate([
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
        ])
        fs.readdir(directoryPath, function async(err, fileList) {
            try {
                if (err) {
                    console.log('Error getting directory information:', err);
                } else {
                    fileList.forEach(function (file) {
                        if (!srs[0].srcs.includes(file)) {
                            fs.unlink(`${directoryPath}/${file}`, function (err) {
                                if (err) throw err;
                                console.log(`${file} deleted!`);
                            });
                        }
                    });
                }
            } catch (e) {

            }
        });


    })
};

export { corn2 as corn2Router };



