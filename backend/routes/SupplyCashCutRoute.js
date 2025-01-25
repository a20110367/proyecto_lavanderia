import express from 'express';
import {
    getSupplyCashCuts,
    getSupplyCashCutsById,
    createSupplyCashCut,
    updateSupplyCashCut,
    deleteSupplyCashCut,
    calculateCashCut,
    closeSupplyCashCut,
    getSupplyCashCutStatus,
    getSupplyLastCashCut
} from "../controllers/SupplyCashCutController.js";

const router = express.Router();

router.get('/supplyCashCuts', getSupplyCashCuts);
router.get('/supplyCashCuts/:id', getSupplyCashCutsById);

router.post('/supplyCashCuts', createSupplyCashCut);

router.patch('/supplyCashCuts/:id', updateSupplyCashCut);

router.delete('/supplyCashCuts/:id', deleteSupplyCashCut);

router.get('/calculateSupplyCashCut/:id', calculateCashCut);
router.get('/getSupplyCashCutStatus', getSupplyCashCutStatus);
router.get('/getSupplyLastCashCut', getSupplyLastCashCut);
router.get('/closeSupplyCashCut/:id', closeSupplyCashCut);

export default router;