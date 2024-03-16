import express from 'express';
import {
    generateTicket,
    generatePartialCashCutTicket,
    cashCutTicket,
    cashWithdrawalTicket,
    pettyCashTicket,
    ironCutTicket,
} from "../controllers/TicketController.js";

const router = express.Router();

router.post('/generateTicket', generateTicket);
router.post('/generatePartialCashCutTicket', generatePartialCashCutTicket);
router.post('/generateCashCutTicket', cashCutTicket);
router.post('/generateCashWithdrawalTicket', cashWithdrawalTicket)
router.post('/generatePettyCashTicket', pettyCashTicket)
router.post('/generateIronCutTicket', ironCutTicket)

export default router;