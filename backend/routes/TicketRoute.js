import express from 'express';
import {
    generateTicket,
    generatePartialCashCutTicket,
} from "../controllers/TicketController.js";

const router = express.Router();

router.post('/generateTicket', generateTicket);
router.post('/generatePartialCashCutTicket', generatePartialCashCutTicket);

export default router;