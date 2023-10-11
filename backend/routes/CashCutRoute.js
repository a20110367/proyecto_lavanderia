import express from 'express';
import {
    getCashCuts,
    getCashCutsById,
    createCashCut,
    updateCashCut,
    deleteCashCut
} from "../controllers/CashCutController.js";

const router = express.Router();

router.get('/cashCuts', getCashCuts);
router.get('/cashCuts/:id', getCashCutsById);
router.post('/cashCuts', createCashCut);
router.patch('/cashCuts/:id', updateCashCut);
router.delete('/cashCuts/:id', deleteCashCut);

export default router;