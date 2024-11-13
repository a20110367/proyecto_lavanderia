import express from 'express';
import {
    generateTicket,
    generatePartialCashCutTicket,
    cashCutTicket,
    cashWithdrawalTicket,
    pettyCashTicket,
    ironCutTicket,
    printReportProduct,
    printCanceledOrder,
    reprintTicket,
    reprintOrder,
    printReportService,
    printReportServiceId,
    printReportProductId,
} from "../controllers/TicketController.js";

const router = express.Router();

router.post('/generateTicket', generateTicket);

router.post('/generatePartialCashCutTicket', generatePartialCashCutTicket);
router.post('/generateCashCutTicket', cashCutTicket);
router.post('/generateCashWithdrawalTicket', cashWithdrawalTicket)
router.post('/generatePettyCashTicket', pettyCashTicket)
router.post('/generateIronCutTicket', ironCutTicket)

router.post('/generate/report/Product', printReportProduct)
router.post('/generate/report/Product/id', printReportProductId)
router.post('/generate/report/Service', printReportService)
router.post('/generate/report/Service/id', printReportServiceId)

router.post('/generate/order/canceled', printCanceledOrder);
router.post('/generate/order/reprint', reprintOrder)
router.post('/generate/ticket/reprint', reprintTicket)

export default router;