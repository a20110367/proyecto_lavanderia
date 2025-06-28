import express from 'express';

import {
    getRefunds,
    getRefundById,
    getActiveRefunds,
    validationRefund,
    createRefund,
    updateRefund,
    deleteRefund
} from "../controllers/RefundControler.js";

const router = express.Router();

router.get('/refunds', getRefunds);
router.get('/activeRefunds', getActiveRefunds);
router.get('/validationRefunds/:id', validationRefund);
router.get('/refunds/:id', getRefundById);
router.post('/refunds', createRefund);
router.patch('/refunds/:id', updateRefund);
router.delete('/refunds/:id', deleteRefund);

export default router;