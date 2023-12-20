import express from 'express';
import {
    getPettyCash,
    getPettyCashBalance,
    createDepositPettyCash,
    createWithdrawalPettyCash,
    updatePettyCash,
    deletePettyCash
} from "../controllers/PettyCashController.js";

const router = express.Router();

router.get('/pettyCash', getPettyCash);
router.get('/pettyCashBalance', getPettyCashBalance);

router.post('/pettyCashDeposit', createDepositPettyCash);
router.post('/pettyCashWithdrawal', createWithdrawalPettyCash);

router.patch('/pettyCash/:id', updatePettyCash);
router.delete('/pettyCash/:id', deletePettyCash);

export default router;