var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import corn from 'node-cron';
import { Cart } from '../../db/models/cart.js';
const corn1 = () => __awaiter(void 0, void 0, void 0, function* () {
    corn.schedule('0 0 1 * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        const result = yield Cart.deleteOne({ date: { $lte: twoMonthsAgo } });
    }));
});
export { corn1 as cornRouter };
