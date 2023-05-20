import corn from 'node-cron'
import { Cart } from '../../db/models/cart.js';

const corn1 = async () => {
    corn.schedule('0 0 1 * *', async () => {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        const result = await Cart.deleteOne({ date: { $lte: twoMonthsAgo } });
    })
};

export { corn1 as cornRouter };

