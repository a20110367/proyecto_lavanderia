import express from 'express';
import {
    getPayments,
    getPaymentsById,
    createPayment,
    updatePayment,
    deletePayment
} from "../controllers/PaymentController.js";

const router = express.Router();

router.get('/payments', getPayments);
router.get('/payments/:id', getPaymentsById);
router.post('/payments', createPayment);
router.patch('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);

export default router;