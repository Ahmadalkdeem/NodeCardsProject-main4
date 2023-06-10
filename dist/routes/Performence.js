var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
const router = Router();
import { Carts } from "../db/models/cart.js";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validatedate } from "../middleware/date.js";
import { validatenumber2 } from "../middleware/number/number2.js";
// import { aggregte } from "./users.js";
import { favorites } from "../db/models/favorites.js";
router.get('/detales', validateToken2, validatenumber2, validatedate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sort = Number(req.query.sort);
        let limet = Number(req.query.limet);
        Carts.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(req.query.str), $lte: new Date(req.query.end)
                    }
                }
            },
            {
                $unwind: "$arr"
            },
            {
                $group: {
                    _id: {
                        id: "$arr.id",
                    },
                    count: {
                        $sum: "$arr.quantity"
                    }
                }
            },
            {
                $sort: {
                    count: sort === 1 ? 1 : -1
                }
            },
            {
                $limit: limet
            },
            {
                $lookup: {
                    from: "pantsproducts",
                    localField: "_id.id",
                    foreignField: "_id",
                    as: "pantsproducts"
                }
            },
            {
                $lookup: {
                    from: "shirtsproducts",
                    localField: "_id.id",
                    foreignField: "_id",
                    as: "shirtsproducts"
                }
            },
            {
                $lookup: {
                    from: "shoesproducts",
                    localField: "_id.id",
                    foreignField: "_id",
                    as: "shoesproducts"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id.id",
                    // color: "$_id.color",
                    count: 1,
                    pants_product: {
                        $cond: {
                            if: { $eq: [{ $ifNull: [{ $arrayElemAt: ["$pantsproducts", 0] }, null] }, null] },
                            then: "$$REMOVE",
                            else: {
                                $arrayToObject: {
                                    $objectToArray: {
                                        $arrayElemAt: ["$pantsproducts", 0]
                                    }
                                }
                            }
                        }
                    },
                    shirts_product: {
                        $cond: {
                            if: { $eq: [{ $ifNull: [{ $arrayElemAt: ["$shirtsproducts", 0] }, null] }, null] },
                            then: "$$REMOVE",
                            else: {
                                $arrayToObject: {
                                    $objectToArray: {
                                        $arrayElemAt: ["$shirtsproducts", 0]
                                    }
                                }
                            }
                        }
                    },
                    shoes_product: {
                        $cond: {
                            if: { $eq: [{ $ifNull: [{ $arrayElemAt: ["$shoesproducts", 0] }, null] }, null] },
                            then: "$$REMOVE",
                            else: {
                                $arrayToObject: {
                                    $objectToArray: {
                                        $arrayElemAt: ["$shoesproducts", 0]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]).then((arr) => {
            res.status(200).json(arr);
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.get('/getorders/detales', validateToken2, validatedate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const str = req.query.str;
        const end = req.query.end;
        Carts.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(str), $lte: new Date(end)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%d-%m-%Y",
                                date: "$date"
                            }
                        }
                    },
                    totalPrice: { $sum: "$pricecart" },
                    avg: { $avg: "$pricecart" },
                    count: { $sum: 1 }
                }
            }, {
                $project: {
                    totalPrice: { $round: ["$totalPrice", 2] },
                    avg: { $round: ["$avg", 2] },
                    count: { $round: ["$count", 2] }
                }
            }, {
                $sort: { _id: 1 }
            }
        ])
            .then((result) => {
            res.json(result);
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
router.get('/getorders/count', validateToken2, validatedate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const str = req.query.str;
        const end = req.query.end;
        Carts.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(str), $lte: new Date(end)
                    }
                }
            },
            { $group: { _id: null, total: { $sum: "$pricecart" }, count: { $sum: 1 }, avg: { $avg: "$pricecart" } } },
            {
                $project: {
                    total: { $round: ["$total", 2] },
                    count: { $round: ["$count", 2] },
                    avg: { $round: ["$avg", 2] }
                }
            }
        ]).then((result) => {
            res.json({ result: result });
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
export let aggregte = [
    {
        $unwind: "$arr"
    },
    {
        $group: {
            _id: "$arr",
            count: { $sum: 1 }
        }
    },
    {
        $lookup: {
            from: "pantsproducts",
            localField: "_id",
            foreignField: "_id",
            as: "pantsproducts"
        }
    },
    {
        $lookup: {
            from: "shirtsproducts",
            localField: "_id",
            foreignField: "_id",
            as: "shirtsproducts"
        }
    },
    {
        $lookup: {
            from: "shoesproducts",
            localField: "_id",
            foreignField: "_id",
            as: "shoesproducts"
        }
    },
    {
        $project: {
            _id: 0,
            count: 1,
            pants_product: {
                $cond: {
                    if: { $eq: [{ $ifNull: [{ $arrayElemAt: ["$pantsproducts", 0] }, null] }, null] },
                    then: "$$REMOVE",
                    else: {
                        $arrayToObject: {
                            $objectToArray: {
                                $arrayElemAt: ["$pantsproducts", 0]
                            }
                        }
                    }
                }
            },
            shirts_product: {
                $cond: {
                    if: { $eq: [{ $ifNull: [{ $arrayElemAt: ["$shirtsproducts", 0] }, null] }, null] },
                    then: "$$REMOVE",
                    else: {
                        $arrayToObject: {
                            $objectToArray: {
                                $arrayElemAt: ["$shirtsproducts", 0]
                            }
                        }
                    }
                }
            },
            shoes_product: {
                $cond: {
                    if: { $eq: [{ $ifNull: [{ $arrayElemAt: ["$shoesproducts", 0] }, null] }, null] },
                    then: "$$REMOVE",
                    else: {
                        $arrayToObject: {
                            $objectToArray: {
                                $arrayElemAt: ["$shoesproducts", 0]
                            }
                        }
                    }
                }
            }
        }
    },
    {
        $sort: {
            count: -1
        }
    },
    {
        $group: {
            _id: null,
            products: {
                $push: {
                    $mergeObjects: ["$pants_product", "$shirts_product", "$shoes_product"]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            products: 1
        }
    }
];
router.get('/favorites', validateToken2, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield favorites.aggregate(aggregte).then(result => {
            res.json(result);
        });
    }
    catch (e) {
        res.status(400).json({
            error: 'oops',
        });
    }
}));
export { router as PerformenceRouter };
