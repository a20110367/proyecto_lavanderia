import express from 'express';
import {
    getCashCuts,
    getCashCutStatus,
    getLastCashCut,
    getCashCutsById,
    createCashCut,
    updateCashCut,
    deleteCashCut,
    calculateCashCut,
    calculateParcialCashCut,
    closeCashCut
} from "../controllers/CashCutController.js";

const router = express.Router();

router.get('/cashCuts', getCashCuts);
router.get('/cashCuts/:id', getCashCutsById);
router.get('/cashCutStatus', getCashCutStatus);
router.get('/lastCashCut', getLastCashCut);
router.get('/calculateCashCut/:id',calculateCashCut);
router.get('/calculateParcialCashCut/:id',calculateParcialCashCut);
router.get('/closeCashCut/:id',closeCashCut);
router.post('/cashCuts', createCashCut);
router.patch('/cashCuts/:id', updateCashCut);
router.delete('/cashCuts/:id', deleteCashCut);

export default router;