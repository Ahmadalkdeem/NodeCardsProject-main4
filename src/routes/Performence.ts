import { Router } from "express";
const router = Router();
import _ from "underscore";
import { Cart } from "../db/models/cart.js";
import { date } from '../db/models/date.js'
import { validateToken2 } from "../middleware/validtetoken2.js";
import { validatedate } from "../middleware/date.js";
import { validatenumber2 } from "../middleware/number2.js";
router.get('/detales/:accessToken/:limet/:sort', validateToken2, validatenumber2, async (req: any, res) => {
    try {
        let sort = Number(req.params.sort)
        let limet = Number(req.params.limet)
        Cart.aggregate([
            {
                $unwind: "$arr"
            },
            {
                $group: {
                    _id: {
                        id: "$arr.id",
                        // color: "$arr.color"
                    },
                    count: {
                        $sum: "$arr.quantity"
                    }
                }
            },
            {
                $sort: {
                    count:
                        sort === 1 ? 1 : -1
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
            res.status(200).json(arr)
        })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})
router.get('/getorders/detales/:accessToken/:str/:end', validateToken2, validatedate, async (req: any, res) => {
    try {
        const str = req.params.str;
        const end = req.params.end;
        date.aggregate([
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
            })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

router.get('/getorders/count/:accessToken/:str/:end', validateToken2, validatedate, async (req: any, res) => {
    try {
        const str = req.params.str;
        const end = req.params.end;
        date.aggregate([
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
        })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

export { router as PerformenceRouter };
