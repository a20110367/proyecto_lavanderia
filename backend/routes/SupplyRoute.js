import express from 'express';
import {
    getSupplies,
    getSuppliesById,
    createSupplies,
    createManySupplies,
    updateSupplies,
    deleteSupplies
} from "../controllers/SupplyControler.js";

const router = express.Router();

router.get('/supplies', getSupplies);
router.get('/supplies/:id', getSuppliesById);

router.post('/supplies', createSupplies);
router.post('/suppliesMany', createManySupplies);

router.patch('/supplies/:id', updateSupplies);

router.delete('/supplies/:id', deleteSupplies);

export default router;