import express from 'express';
import {
    generateTicket,
    generatePartialCashCutTicket,
    cashCutTicket,
    cashWithdrawalTicket,
    pettyCashTicket,
    ironCutTicket,
    printReportProduct,
} from "../controllers/TicketController.js";

const router = express.Router();

router.post('/generateTicket', generateTicket);
router.post('/generatePartialCashCutTicket', generatePartialCashCutTicket);
router.post('/generateCashCutTicket', cashCutTicket);
router.post('/generateCashWithdrawalTicket', cashWithdrawalTicket)
router.post('/generatePettyCashTicket', pettyCashTicket)
router.post('/generateIronCutTicket', ironCutTicket)
router.post('/generateReportProduct', printReportProduct)

export default router;