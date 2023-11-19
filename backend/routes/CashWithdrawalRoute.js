import express from 'express';
import {
    getCashWithdrawals,
    getCashWithdrawalsById,
    createCashWithdrawal,
    updateCashWithdrawal,
    deleteCashWithdrawal
} from "../controllers/CashWithdrawalController.js";

const router = express.Router();

router.get('/cashWithdrawals', getCashWithdrawals);
router.get('/cashWithdrawals/:id', getCashWithdrawalsById);
router.post('/cashWithdrawals', createCashWithdrawal);
router.patch('/cashWithdrawals/:id', updateCashWithdrawal);
router.delete('/cashWithdrawals/:id', deleteCashWithdrawal);

export default router;