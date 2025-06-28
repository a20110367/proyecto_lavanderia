import express from 'express';
import {
    sendMessage,
    notifyAll,
    sendReport,
    sendCashCut,
    sendWarningCanceledOrder,
    sendWarningReceiptReprinted,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post('/sendMessage', sendMessage);
router.post('/sendReport', sendReport);
router.post('/sendCashCut', sendCashCut);
router.post('/notifyAll', notifyAll);

router.post('/sendWarning', sendWarningCanceledOrder);
router.post('/warning/reprint', sendWarningReceiptReprinted);

export default router;