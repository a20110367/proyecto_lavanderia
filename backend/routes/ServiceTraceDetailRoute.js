import express from 'express';
import {
    getServiceTraceDetails,
    getServiceTraceDetailsById,
    createServiceTraceDetail,
    updateServiceTraceDetail,
    deleteServiceTraceDetail
} from "../controllers/ServiceTraceDetailController.js";

const router = express.Router();

router.get('/serviceTraceDetails', getServiceTraceDetails);
router.get('/serviceTraceDetails/:id', getServiceTraceDetailsById);
router.post('/serviceTraceDetails', createServiceTraceDetail);
router.patch('/serviceTraceDetails/:id', updateServiceTraceDetail);
router.delete('/serviceTraceDetails/:id', deleteServiceTraceDetail);

export default router;