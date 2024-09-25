import express from 'express';
import {
    sendMessage,
    notifyAll,
    sendReport,
    sendCashCut,
    sendWarningCanceledOrder,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post('/sendMessage', sendMessage);
router.post('/sendReport', sendReport)
router.post('/sendCashCut', sendCashCut)
router.post('/notifyAll', notifyAll)
router.post('/sendWarning', sendWarningCanceledOrder)

export default router;