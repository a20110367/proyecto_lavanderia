import express from 'express';
import {
    getSupplyCashCuts,
    getSupplyCashCutsById,
    createCashCut,
    updateSupplyCashCut,
    deleteSupplyCashCut,
    calculateSupplyCashCut,
    closeCashCut,
    getCashCutStatus,
    getLastCashCut
} from "../controllers/SupplyCashCutController.js";

const router = express.Router();

router.get('/supplyCashCuts', getSupplyCashCuts);
router.get('/supplyCashCuts/:id', getSupplyCashCutsById);

router.post('/supplyCashCuts', createCashCut);

router.patch('/supplyCashCuts/:id', updateSupplyCashCut);

router.delete('/supplyCashCuts/:id', deleteSupplyCashCut);

router.get('/calculateSupplyCashCut/:id', calculateSupplyCashCut);
router.get('/getSupplyCashCutStatus', getCashCutStatus);
router.get('/getSupplyLastCashCut', getLastCashCut);
router.patch('/closeSupplyCashCut/:id', closeCashCut);

export default router;