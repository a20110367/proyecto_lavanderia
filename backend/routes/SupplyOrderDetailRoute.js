import express from 'express';
import {
    getSupplyOrderDetails,
    getSupplyOrderDetailsById,
    createSupplyOrderDetails,
    createManySupplyOrderDetails,
    updateSupplyOrderDetails,
    deleteSupplyOrderDetails
} from "../controllers/SupplyOrderDetailContoller.js";

const router = express.Router();

router.get('/supplyOrderDetails', getSupplyOrderDetails);
router.get('/supplyOrderDetails/:id', getSupplyOrderDetailsById);

router.post('/supplyOrderDetails', createSupplyOrderDetails);
router.post('/supplyOrderDetailsMany', createManySupplyOrderDetails);

router.patch('/supplyOrderDetails/:id', updateSupplyOrderDetails);

router.delete('/supplyOrderDetails/:id', deleteSupplyOrderDetails);

export default router;