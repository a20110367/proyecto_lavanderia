import express from 'express';
import {
    sendMessage,
    notifyAll,
    sendReport,
    sendCashCut,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post('/sendMessage', sendMessage);
router.post('/sendReport', sendReport)
router.post('/sendCashCut', sendCashCut)
router.post('/notifyAll', notifyAll)

export default router;