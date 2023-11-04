import express from 'express';
import {
    getCashWhithdrawals,
    getCashWhithdrawalsById,
    createCashWhithdrawal,
    updateCashWhithdrawal,
    deleteCashWhithdrawal
} from "../controllers/CashWithdrawalController.js";

const router = express.Router();

router.get('/cashWhithdrawals', getCashWhithdrawals);
router.get('/cashWhithdrawals/:id', getCashWhithdrawalsById);
router.post('/cashWhithdrawals', createCashWhithdrawal);
router.patch('/cashWhithdrawals/:id', updateCashWhithdrawal);
router.delete('/cashWhithdrawals/:id', deleteCashWhithdrawal);

export default router;