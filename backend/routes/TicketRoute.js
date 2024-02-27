import express from 'express';
import {
    generateTicket,
    generatePartialCashCutTicket,
    cashCutTicket,
} from "../controllers/TicketController.js";

const router = express.Router();

router.post('/generateTicket', generateTicket);
router.post('/generatePartialCashCutTicket', generatePartialCashCutTicket);
router.post('/generateCashCutTicket', cashCutTicket);

export default router;