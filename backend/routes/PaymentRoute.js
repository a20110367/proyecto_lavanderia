import express from 'express';
import {
    getPayments,
    getPaymentsById,
    createPayment,
    createPaymentAdvance,
    createPaymentDelivery,
    updatePayment,
    deletePayment,
    testPayment
} from "../controllers/PaymentController.js";

const router = express.Router();

router.get('/payments', getPayments);
router.get('/payments/:id', getPaymentsById);
router.get('/paymentsTest/:id', testPayment);


router.post('/payments', createPayment);
router.post('/paymentsDelivery', createPaymentDelivery);
router.post('/paymentsAdvance', createPaymentAdvance);


router.patch('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);

export default router;