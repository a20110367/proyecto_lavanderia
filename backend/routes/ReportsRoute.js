import express from 'express';
import {
    // getGeneralReport,
    getSuppliesReport,
    getServicesReport,
    getSuppliesReportById,
    getServicesReportById,
    getIncomeReport
} from "../controllers/ReportsController.js";

const router = express.Router();

// router.get('/generalReport/:startDate/:endDate', getGeneralReport);
router.get('/suppliesReport/:startDate/:endDate', getSuppliesReport);
router.get('/suppliesReport/:startDate/:endDate/:supplyId', getSuppliesReportById);
router.get('/servicesReport/:startDate/:endDate', getServicesReport);
router.get('/servicesReport/:startDate/:endDate/:categoryId/:serviceId', getServicesReportById);
router.get('/incomeReport/:startDate/:endDate', getIncomeReport);
// router.get('/lastCashCut', getLastCashCut);
// router.get('/calculateCashCut/:id',calculateCashCut);
// router.get('/closeCashCut/:id',closeCashCut);
// router.post('/cashCuts', createCashCut);
// router.patch('/cashCuts/:id', updateCashCut);
// router.delete('/cashCuts/:id', deleteCashCut);

export default router;