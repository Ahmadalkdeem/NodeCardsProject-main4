import { Router } from "express";
const router = Router();
import _ from "underscore";
import { Carts } from "../db/models/cart.js";
import { validateToken2 } from "../middleware/validtetoken/validtetoken2.js";
import { validatedate } from "../middleware/date.js";
import { validatenumber2 } from "../middleware/valNumber/sortAndSkip.js";
import { favorites } from "../db/models/favorites.js";
import { validatefind } from "../middleware/find/validatefind.js";
import { Find2 } from "../middleware/find/find2.js";
router.get('/detales', validateToken2, validatenumber2, validatedate, validatefind, Find2, async (req: any, res) => {
    try {
        const match = { $match: { $and: req.find } };
        let sort = Number(req.query.sort)
        let limet = Number(req.query.limet)
        Carts.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(req.query.str),
                        $lte: new Date(req.query.end)
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
                $lookup: {
                    from: "pantsproducts",
                    localField: "_id.id",
                    foreignField: "_id",
                    as: "pantsproducts",
                    pipeline: req.find.length !== 0 ? [match] : []
                }
            },
            {
                $lookup: {
                    from: "shirtsproducts",
                    localField: "_id.id",
                    foreignField: "_id",
                    as: "shirtsproducts",
                    pipeline: req.find.length !== 0 ? [match] : []
                }
            },
            {
                $lookup: {
                    from: "shoesproducts",
                    localField: "_id.id",
                    foreignField: "_id",
                    as: "shoesproducts",
                    pipeline: req.find.length !== 0 ? [match] : []
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id.id",
                    count: 1,
                    pants_product: {
                        $cond: {
                            if: { $eq: [{ $size: "$pantsproducts" }, 0] },
                            then: "$$REMOVE",
                            else: {
                                $arrayElemAt: ["$pantsproducts", 0]
                            }
                        }
                    },
                    shirts_product: {
                        $cond: {
                            if: { $eq: [{ $size: "$shirtsproducts" }, 0] },
                            then: "$$REMOVE",
                            else: {
                                $arrayElemAt: ["$shirtsproducts", 0]
                            }
                        }
                    },
                    shoes_product: {
                        $cond: {
                            if: { $eq: [{ $size: "$shoesproducts" }, 0] },
                            then: "$$REMOVE",
                            else: {
                                $arrayElemAt: ["$shoesproducts", 0]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    $or: [
                        { pants_product: { $nin: [null] } },
                        { shirts_product: { $nin: [null] } },
                        { shoes_product: { $nin: [null] } }
                    ]
                }
            }, {
                $limit: limet
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

router.get('/getorders/detales', validateToken2, validatedate, async (req: any, res) => {
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
            })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

router.get('/favorites', validateToken2, validatefind, Find2, async (req: any, res) => {
    try {
        const match = { $match: { $and: req.find } };

        await favorites.aggregate(
            [
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
                        as: "pantsproducts",
                        pipeline: req.find.length !== 0 ? [match] : []
                    }
                },
                {
                    $lookup: {
                        from: "shirtsproducts",
                        localField: "_id",
                        foreignField: "_id",
                        as: "shirtsproducts",
                        pipeline: req.find.length !== 0 ? [match] : []
                    }
                },
                {
                    $lookup: {
                        from: "shoesproducts",
                        localField: "_id",
                        foreignField: "_id",
                        as: "shoesproducts",
                        pipeline: req.find.length !== 0 ? [match] : []
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
                                        $filter: {
                                            input: { $objectToArray: { $arrayElemAt: ["$pantsproducts", 0] } },
                                            cond: { $ne: ["$$this.v", null] }
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
                                        $filter: {
                                            input: { $objectToArray: { $arrayElemAt: ["$shirtsproducts", 0] } },
                                            cond: { $ne: ["$$this.v", null] }
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
                                        $filter: {
                                            input: { $objectToArray: { $arrayElemAt: ["$shoesproducts", 0] } },
                                            cond: { $ne: ["$$this.v", null] }
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
                        products: {
                            $filter: {
                                input: "$products",
                                as: "product",
                                cond: { $ne: ["$$product", {}] }
                            }
                        }
                    }
                }
            ]
        ).then(result => {
            res.json(result);
        })
    } catch (e) {
        res.status(400).json({
            error: 'oops',
        })
    }
})

export { router as PerformenceRouter };
