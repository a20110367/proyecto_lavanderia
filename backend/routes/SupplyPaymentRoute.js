import express from 'express';
import {
    getSupplyPayments,
    getSupplyPaymentsById,
    createSupplyPayment,
    updatePayment,
    deletePayment,
} from "../controllers/SupplyPaymentController.js";

const router = express.Router();

router.get('/supplyPayment', getSupplyPayments);
router.get('/supplyPayment/:id', getSupplyPaymentsById);

router.post('/supplyPayment', createSupplyPayment);

router.patch('/supplyPayment/:id', updatePayment);

router.delete('/supplyPayment/:id', deletePayment);

export default router;