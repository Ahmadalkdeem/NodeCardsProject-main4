import corn from 'node-cron'
import { Carts } from '../../db/models/cart.js';

const orders = async () => {
    corn.schedule('0 0 1 * *', async () => {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 3);
        const result = await Carts.deleteMany({ date: { $lte: twoYearsAgo } });
    })
};

export { orders as ordersTest };

